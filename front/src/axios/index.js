import axios from 'axios';
import config from '@/config'
import { useAuthStore } from '@/stores/AuthStore';
import { storeToRefs } from 'pinia';

const NOT_LOGGED = "Not logged"

export default axios.create(config["axios"]);
const refresh = async () => {
  const authStore = useAuthStore();
  const {access_token} = storeToRefs(authStore)
  return authStore.$refreshToken()
    .then(async (res) => {
      const bearer_token = "Bearer " + res;
      await authStore.$set_access_token(bearer_token);
      return},
      (err) => { return Promise.reject(err) })
}
const remove_interceptors = (axios_instance, requestIn, responseIn) => {
  axios_instance.interceptors.request.eject(requestIn);
  axios_instance.interceptors.response.eject(responseIn);

}
export const useInterceptors = async (axiosToIntercept) => {
  const requestIntercept = axiosToIntercept.interceptors.request.use(
    async config => {
      const authStore = useAuthStore();
      const { access_token } = storeToRefs(authStore);
      config.headers['Authorization'] = access_token.value;
      return config
    }, (error) => {
      if (config.sent === true) {
        return Promise.reject("error", error);
      }

    }
  )

  const responseIntercept = axiosToIntercept.interceptors.response.use(
    response => response,
    async (error) => {
      const authStore = useAuthStore();
      const prevRequest = error?.config;
      if (error?.response?.status === 401 &&
        (error?.response?.data?.name === "AccessTokenNoSet" || error?.response?.data?.name === "ExpiredAccessToken") && !prevRequest?.sent) {
        await refresh()
        prevRequest.headers['Authorization'] = await authStore.$get_access_token();
        return axiosToIntercept(prevRequest);
      }
      if (prevRequest?.sent && (error?.response?.data?.name === "ExpiredRefreshToken")) {
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        authStore.$logout();
      }
      return Promise.reject(error);
    }
  )
}

//this function doesn't work on authStore, not use there.
export const axiosInterceptors = (() => {
  const axios_private = axios.create(config["axios"]);
  useInterceptors(axios_private);
  return axios_private;
})();
