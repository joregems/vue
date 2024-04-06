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
const conection_up = ref(false);
(function my_func() {
  const is_up = authStore.$check_conection();
  if (!is_up) {
    setTimeout(my_func, Math.random() * (60000 - 25000) + 25000);
  }
  else {
    conection_up.value = true;
  }
})();

const appTitle = 'magic';
const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Sign Up', path: '/signup', icon: 'mdi-lock-open' },
  { title: 'Sign In', path: '/signin', icon: 'mdi-login' }
]

</script>

<template>

  <v-app>
    <TopNavBar></TopNavBar>
    <v-container class="content">
       <!-- <AxiosPrivate /> -->
      <router-view />
    </v-container>
  </v-app>
</template>
<style scoped>
.content {
  margin-top: 20dvh;
}
</style>
