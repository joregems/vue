import axios from 'axios';
import config from '@/config.json'

export default axios.create({
  withCredentials: config.axios.withCredentials,
  baseURL: config.axios.URLBASE
})
export const useInterceptors = (axiosToIntercept)=>{
  const refresh = async () => {
    axiosToIntercept
      .post('/refresh')
  }
  axiosToIntercept.interceptors.request.use(
    config => {
      config.sent = false
      return config;
    }, (error) => {
      Promise.reject("error", error)
    }
  )
  axiosToIntercept.interceptors.response.use(
    response => response,
    async (error) => {
      const prevRequest = error?.config;
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        await refresh();
        return axiosToIntercept(prevRequest)
        // axios.interceptors.response.eject(requestIntercept);
        // axios.interceptors.response.eject(responseIntercept);
      }
      return Promise.reject(error);
    }
  )
}