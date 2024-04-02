import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios';
import { useInterceptors } from '@/axios';

useInterceptors(axios);

const is_empty = (obj) => (Object.keys(obj).length === 0);

export const user_adapter = {
  "email": { type: 'text', icon: 'mdi-email' },
  "password": { type: 'password', icon: 'mdi-key' },
  "name": { type: 'text', icon: 'mdi-face-man' },
  "role": { type: 'options', icon: '', items: ['admin', 'user'] },
}

export const useUserStore = defineStore('userStore', () => {
  const users = ref([]);
  const user = ref({});

  async function $get_users() {
    const response = await axios.get('users');
    users.value = response.data
    return response.data;
  }
  function $get_adapter() {
    return user_adapter;
  }

  function $set_user(user_) {
    user.value = user_;
  }
  async function $update(user_) {
    const url = 'users' + '/' + user_.uuid;
    return axios.put(url, user_).then(async (response) => {
      await $get_users();
      return response;
    }, (error) => { throw error });
  }
  async function $delete(user_) {
    const url = 'users' + '/' + user_.uuid;
    return axios.delete(url, user_).then(async (response) => {
      await $get_users();
      return response;
    }, (error) => { throw error });
  }
  return { user, users, $get_adapter, $set_user, $get_users, $delete, $update }
})