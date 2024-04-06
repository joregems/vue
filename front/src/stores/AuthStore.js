import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios';
import { useInterceptors } from '@/axios';
useInterceptors(axios);
const is_empty = (obj) => (Object.keys(obj).length === 0);
export const useAuthStore = defineStore('authStore', () => {
  const user = ref({})
  const is_logged = ref(false)
  const loading = ref(true)
  const $reset = () => {
    user.value = {}
    is_logged.value = false
    loading.value = true
  }

  async function $login(data) {
    if (is_empty(user.value)) {
      axios.post('login', data)
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
    return axios.post('users', data)
      .then(
        (response) => {
          return response
        },
        (error) => {
          throw error
        })
  }

  async function $logout() {
    axios.get('logout').then((response) => {
    })
      .catch((error) => { //console.log(error)
      })
      .finally(() => {
        $reset();
      })
  }
  async function $check_logged() {
    let res = false;
    try {
      const response = await axios.post('check')
      if (response.data) {
        user.value = response.data
        is_logged.value = true;
        loading.value = false
        res = true;
      }
    }
    catch {

    }

    return res

  }

  async function $check_conection() {
    axios.get('check_connection')
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      })
  }

  async function $check_logged() {
    let res = false;
    try {
      const response = await axios.post('check')
      if (response.data) {
        user.value = response.data
        is_logged.value = true;
        loading.value = false
        res = true;
      }
    }
    catch {

    }

    return res

  }
  return { user, is_logged, loading, $check_conection, $login, $signup, $check_logged, $logout, $reset }
})