<script setup>
import TopNavBar from './components/TopNavBar.vue'
import HomeView from './views/HomeView.vue'
import { useRouter, RouterView } from 'vue-router'
import '@mdi/font/css/materialdesignicons.css'
import { ref } from 'vue'
import axios from './axios'
const router = useRouter()
const logo = "@/assets/logo.svg"

router.addRoute({ path: '/about2', component: HomeView })
const sidebar = ref(false);
const change = () => {
  sidebar.value = !sidebar.value
}
const appTitle = 'magic';
const menuItems = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Sign Up', path: '/signup', icon: 'mdi-lock-open' },
  { title: 'Sign In', path: '/signin', icon: 'mdi-login' }
]

</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Vuetify</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn icon variant="outlined">
        <v-icon>mdi-lock-open</v-icon>
      </v-btn>
    </v-app-bar>
    <v-container class="content">
      <!-- <AxiosPrivate /> -->
      <router-view />
    </v-container>
  </v-app>

  <!-- <v-toolbar
      dark
      prominent
      image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Vuetify</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn icon variant="outlined">
        <v-icon>mdi-lock-open</v-icon>
      </v-btn>
    </v-toolbar> -->
</template>


<style scoped>
.content {
  margin-top: 20dvh;
}
</style>
