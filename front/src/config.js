const env = import.meta.env;
console.log(env)
const config = {
  "axios":{
  "baseURL":env.VITE_API_URL,
  "withCredentials": true
}}
export default config;