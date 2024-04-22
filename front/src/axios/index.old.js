import axios from 'axios';
import config from '@/config'
import { useAuthStore } from '@/stores/AuthStore';
import { storeToRefs } from 'pinia';

const NOT_LOGGED = "Not logged"

export default axios.create(config["axios"]);
const refresh = async () => {
  const authStore = useAuthStore();
  await authStore.$refreshToken()
  .then((response)=>{return response}).catch((error)=>{throw error});
}
const remove_interceptors = (axio, requestIn, responseIn) => {
  axio.interceptors.request.eject(requestIn);
  axio.interceptors.response.eject(responseIn);

}
export const useInterceptors = (axiosToIntercept) => {
  const requestIntercept = axiosToIntercept.interceptors.request.use(
    async config => {
      const authStore = useAuthStore();
      const { access_token } = storeToRefs(authStore);
      if (!Object.is(access_token.value, undefined))
        config.headers['Authorization'] = access_token.value;
      return config
    }, (error) => {
      if (config.sent === true) {
      }
      return Promise.reject("error", error);


    }
  )

  const responseIntercept = axiosToIntercept.interceptors.response.use(
    response => response,
    async (error) => {
      const authStore = useAuthStore();
      const { access_token } = storeToRefs(authStore);
      const prevRequest = error?.config;
      // error?.response?.data?.name == "CookiesSetButNotAccessToken" &&
      if ( error?.response?.status === 401 && !prevRequest?.sent) {
        console.log("1")
        console.log(prevRequest.sent)
        prevRequest.sent = true;
        await refresh().catch((error)=>{console.log(error)})
        console.log("3")
        prevRequest.headers['Authorization'] = access_token.value;
        console.log("4", prevRequest.headers['Authorization']);
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        console.log("5")

        return axiosToIntercept(prevRequest);
      }
      if ((error?.response?.data?.name == "InvalidRefreshToken")) {
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        // authStore.$logout();
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
