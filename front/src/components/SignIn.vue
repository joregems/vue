<template>
  <GenericForm :obj="form" submitName="login" :adapter="user_adapter" :submit="authStore.$login" :callback="callback">
    <template v-slot:down>
      <v-btn @click='() => { router.push({ name: "signup" }) }' block class="mt-2">singUp</v-btn>
    </template>
  </GenericForm>
</template>
<script setup>
import GenericForm from '@/components/GenericForm.vue';
import { user_adapter } from '@/stores/UserStore'
import { ref } from 'vue';
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore();
const form = ref({
  email: '',
  password: '',
})

const callback = () => {
  router.push({ name: "home" })
}

</script>