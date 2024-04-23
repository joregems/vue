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
      const bearer_touken = "Bearer " + res;
      await authStore.$set_access_token(bearer_touken);
      return},
      (err) => { return Promise.reject(err) })
}
const remove_interceptors = (axio, requestIn, responseIn) => {
  axio.interceptors.request.eject(requestIn);
  axio.interceptors.response.eject(responseIn);

}
export const useInterceptors = async (axiosToIntercept) => {
  console.log("unterceptors")
  const requestIntercept = axiosToIntercept.interceptors.request.use(
    async config => {
      console.log("intercepter")
      const authStore = useAuthStore();
      const { access_token } = storeToRefs(authStore);
      // if (!Object.is(access_token.value, undefined))
      console.log(access_token.value)
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
      console.log("responder")

      const authStore = useAuthStore();
      // const { access_token } = storeToRefs(authStore);
      const prevRequest = error?.config;
      // error?.response?.data?.name == "CookiesSetButNotAccessToken" &&
      // && error?.response?.status === 401
      if (error?.response?.status === 401 &&
        (error?.response?.data?.name === "AccessTokenNoSet" || error?.response?.data?.name === "ExpiredAccessToken") && !prevRequest?.sent) {
        console.log("aplie to retry", error)
        await refresh()
        prevRequest.headers['Authorization'] = await authStore.$get_access_token();
        // remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        return axiosToIntercept(prevRequest);
      }
      if (prevRequest?.sent && (error?.response?.data?.name === "ExpiredRefreshToken")) {
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        authStore.$logout();
      }
      else
        // remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);

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
// export const useCheckLogin = async (axios_for_use)=>{
//   const user = await axios_for_use.post('/check')
//   const store = useAuthStore();
// }
