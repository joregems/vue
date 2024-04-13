<template>


  <v-app>
    <v-dialog v-model="conection_down" fullscreen full-width>
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular indeterminate color="primary">
            waiting the server
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <TopNavBar></TopNavBar>

    <v-container class="content">
      <!-- <AxiosPrivate /> -->
      <router-view />
    </v-container>
  </v-app>
</template>

<script setup>
import TopNavBar from './components/TopNavBar.vue';
import HomeView from './views/HomeView.vue';
import { useRouter, RouterView } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css';
import { ref } from 'vue';
const router = useRouter();
// router.addRoute({ path: '/about2', component: HomeView })

const logo = "@/assets/logo.svg";
import { useAuthStore } from '@/stores/AuthStore';
const authStore = useAuthStore();
import { storeToRefs } from 'pinia';
const { is_logged, loading, user } = storeToRefs(authStore);
router.addRoute({ path: '/about2', component: HomeView });
const sidebar = ref(false);
const loading2 = false
const conection_down = ref(true);

(async function my_func() {
  conection_down.value = await authStore.$is_down_conection()
  if (conection_down.value) {
    setTimeout(my_func, Math.random() * (12000 - 6000) + 6000);
  }
})();

// (async function my_func() {
//   console.log("ches")
//   setTimeout(my_func, Math.random() * (6000 - 2500) + 2500);
// })();
// try{
//   conection_up.value = await authStore.$check_conection((response)=>{
//     console.log("bien")
//   }).catch((error)=>{
//     throw error
//   });    
// }
// catch{
//   conection_up.value = false

// }

// if (!conection_up.value) {
//   console.log("print")
//   setTimeout(my_func, Math.random() * (60000 - 25000) + 25000);
// }
// else {
//   conection_up.value = true;
// }

// (async function my_func() {
//   console.log("ches")
//   setTimeout(my_func, Math.random() * (6000 - 2500) + 2500);
// })();

const appTitle = 'magic';
const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Sign Up', path: '/signup', icon: 'mdi-lock-open' },
  { title: 'Sign In', path: '/signin', icon: 'mdi-login' }
]

</script>

<style scoped>
.content {
  margin-top: 20dvh;
}
</style>
