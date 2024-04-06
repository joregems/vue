import axios from 'axios';
import config from '@/config'
import { useAuthStore } from '@/stores/AuthStore';

export default axios.create(config["axios"])
export const useInterceptors = (axiosToIntercept) => {
  const refresh = async () => {
    axiosToIntercept
      .post('/refresh')
      .catch((error)=>{});
  }
  const remove_interceptors = (axio, requestIn, responseIn) => {
    axio.interceptors.request.eject(requestIn);
    axio.interceptors.response.eject(responseIn);

  }
  const requestIntercept = axiosToIntercept.interceptors.request.use(
    config => {
      // config.sent = false
      return config;
    }, (error) => {
      return Promise.reject("error", error);
    }
  )
  const responseIntercept = axiosToIntercept.interceptors.response.use(
    response => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.data?.name=="InvalidAccessToken"&&error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        await refresh();
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        return axiosToIntercept(prevRequest);
      }
      if ((error?.response?.data?.name=="NoAccessTokenError"||error?.response?.data?.name=="InvalidRefreshToken")) {
        remove_interceptors(axiosToIntercept, requestIntercept, responseIntercept);
        const authStore = useAuthStore();
        authStore.$logout();
      }
      return Promise.reject(error);
    }
  )
}

// export const useCheckLogin = async (axios_for_use)=>{
//   const user = await axios_for_use.post('/check')
//   const store = useAuthStore();
// }
