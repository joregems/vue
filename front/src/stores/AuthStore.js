import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios';
import { useInterceptors } from '@/axios';
import { axiosInterceptors } from '@/axios';//not works because this is used on the interceptor to set the bearer
const is_empty = (obj) => (Object.keys(obj).length === 0);

export const useAuthStore = defineStore('authStore', () => {
  const user = ref({})
  const is_logged = ref(false)
  const loading = ref(true)
  const access_token = ref(undefined)

  const $set_access_token = async (token) => {
    access_token.value = token;
  }
  const $get_access_token = async () => {
    return access_token.value;
  }
  const $reset = () => {
    user.value = {}
    is_logged.value = false
    loading.value = true
    access_token.value = ref(undefined)

  }

  async function $login(data) {
    if (is_empty(user.value)) {
      axiosInterceptors.post('login', data)
        .then((response) => {
          user.value = { "name": response.data.name, "role": response.data.role }
          is_logged.value = true
          loading.value = false
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  async function $signup(data) {
    return axiosInterceptors.post('users', data)
      .then(
        (response) => {
          return response
        },
        (error) => {
          throw error
        })
  }

  async function $logout() {
    axiosInterceptors.get('logout')
      .then((response) => {
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        $reset();
      })
  }

  async function $check_logged() {
    useInterceptors(axios);
    return axios.post('check').then((response) => {
      user.value = response.data
      is_logged.value = true;
      loading.value = false
      return true;
    },
      (error) => {
        console.log(error)
        return false
      })

  }



  async function $is_down_connection() {
    let status_ = false
    await axiosInterceptors.get('check_connection').then(() => { status_ = false }).catch(() => { status_ = true })
    return status_
  }

  async function $refreshToken() {
    return axiosInterceptors.post('/refresh')
      .then((res) => {
        return res.data;
      },(error) => {
        console.log(error);
        return Promise.reject(error)
      });
  }


  return { user, is_logged, access_token, loading, $set_access_token, $get_access_token, $is_down_connection, $login, $signup, $check_logged, $logout, $reset, $refreshToken }
})