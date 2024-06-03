<template>
  <AwaitingOverlay v-model="connection_down"></AwaitingOverlay>
  <v-card>
    <v-layout>
      <SideNavBar :active_sidebar="active_sidebar" @toggle=" active_sidebar = $event">
      </SideNavBar>
      <TopNavBar class="navbar" width="80" :active_sidebar="active_sidebar"
        @toggle="() => { active_sidebar = false; active_sidebar = true }">
      </TopNavBar>
      <v-main class="content">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import '@/normalize.css'
import { default as TopNavBar } from './components/navigation/TopNavBar.vue';
import { default as SideNavBar } from '@/components/navigation/SideNavBar.vue';
import { RouterView } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css';
import { ref } from 'vue';
import AwaitingOverlay from '@/components/AwaitingOverlay.vue'
import { useAuthStore } from '@/stores/AuthStore';
const authStore = useAuthStore();
const active_sidebar = ref(false)
const connection_down = ref(true);

//execute this function while the server is not ready.
(async function check_server() {
  connection_down.value = await authStore.$is_down_connection()
  if (connection_down.value) {
    setTimeout(check_server, Math.random() * (12000 - 6000) + 6000);
  }
})();
</script>
<style scoped>
.content {
  margin-top: 80px;
  width: 100%;
  scroll-behavior: smooth;
  min-height: calc(100dvh - 80px);
}
</style>
