import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
const empty_user = {name:'',role:''}
export const useUserStore = defineStore('user', () => {
  const user = ref(empty_user)
  function $reset() {
    user.value = empty_user
  }
  function $set_user(_user) {
    user.value=_user
  }
  
  return { user, $reset, $set_user }
})