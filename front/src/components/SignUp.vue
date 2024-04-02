<template>
  <GenericForm :obj="form" submitName="signup"
  :errors="errors" :adapter="user_adapter"
  :submit="authStore.$signup" :callback="callback" />
</template>
<script setup>
import GenericForm from '@/components/GenericForm.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore'
import { user_adapter } from '@/stores/UserStore'
import axios from '@/axios';
import { useInterceptors } from '@/axios';
import { useRouter } from 'vue-router'

user_adapter.role["disabled"]=true;
useInterceptors(axios);
const DEBUG = process.env.NODE_ENV === "development";
const form = ref({
  email: '',
  password: '',
  name: '',
  role: '',
})
const router = useRouter()
const errors = ref([])
const authStore = useAuthStore();
const callback = () => {
  alert("user has been created")
  router.push({ name: "signin" })
}
</script>