import axios from 'axios';
import config from '@/config'
import { useAuthStore } from '@/stores/AuthStore';
import { storeToRefs } from 'pinia';

const NOT_LOGGED = "Not logged"

export default axios.create(config["axios"]);
const refresh = async () => {
  const authStore = useAuthStore();
  return authStore.$refreshToken()
    .then((res) => { console.log(res); return res },
      (err) => { return Promise.reject(err) })


}
const remove_interceptors = (axio, requestIn, responseIn) => {
  axio.interceptors.request.eject(requestIn);
  axio.interceptors.response.eject(responseIn);

}
export const useInterceptors = async (axiosToIntercept) => {
  // console.log(await refresh().catch((err)=>{console.log(err)}))
  const requestIntercept = axiosToIntercept.interceptors.request.use(
    async config => {
      const authStore = useAuthStore();
      const { access_token } = storeToRefs(authStore);
      if (!Object.is(access_token.value, undefined))
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
      const { access_token } = storeToRefs(authStore);
      const prevRequest = error?.config;
      // error?.response?.data?.name == "CookiesSetButNotAccessToken" &&
      // && error?.response?.status === 401
      if (error?.response?.status === 401&&(error?.response?.data?.name === "NoAccessTokenError"||error?.response?.data?.name === "ExpiredAccessToken")  && !prevRequest?.sent) {
        console.log("aplie to retry", error)
        const touken = await refresh()
        const bearer_touken = "Bearer "+ touken;
        access_token.value = bearer_touken
        prevRequest.headers['Authorization'] = access_token.value;
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        return axiosToIntercept(prevRequest);
      }
      if ((error?.response?.data?.name == "InvalidRefreshToken")) {
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        authStore.$logout();
      }
      // if ((error?.response?.data?.name=="NoAccessTokenError"||error?.response?.data?.name=="InvalidRefreshToken")) {
      //   remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
      //   const authStore = useAuthStore();
      //   authStore.$logout()
      // }
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
