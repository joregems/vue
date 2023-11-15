<template>
  <v-sheet width="300" class="mx-auto">
    <v-form @submit.prevent="submit">
      <v-text-field variant="solo" prepend-inner-icon="mdi-email" v-model="form.email"
        label="Email"></v-text-field>
      <v-text-field type="password" variant="solo" prepend-inner-icon="mdi-key" v-model="form.password"
        label="Password">
      </v-text-field>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-sheet>
  <button @click="click">clicjeame</button>
</template>
<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'
const store = useUserStore();
import axios from '../axios';
import { useInterceptors } from '../axios';
useInterceptors(axios);

const DEBUG = process.env.NODE_ENV === "development";

const form = ref({
  email: '',
  password: '',
})
function submit() {
  axios
    .post('login', form.value)
    .then((response) => alert(JSON.stringify(response.data)))
}
function click() {
  axios
    .get('users')
    .then((response) => {
      alert(JSON.stringify(response))
    })
    .catch((error) => {
      alert(JSON.stringify(error))
    })

}
</script>