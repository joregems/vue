<template>
  <v-app>
    <v-dialog v-model="conection_down" fullscreen full-width>
      waiting the server
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular indeterminate color="primary">
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <TopNavBar></TopNavBar>
    <v-container class="content">
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

router.addRoute({ path: '/about2', component: HomeView });
const conection_down = ref(true);

(async function my_func() {
  conection_down.value = await authStore.$is_down_conection()
  if (conection_down.value) {
    setTimeout(my_func, Math.random() * (12000 - 6000) + 6000);
  }
})();
</script>

<style scoped>
.content {
  margin-top: 20dvh;
}
</style>
