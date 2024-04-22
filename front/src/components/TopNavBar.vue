<script setup>
import '@mdi/font/css/materialdesignicons.css'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
const authStore = useAuthStore();
const { is_logged, loading, user } = storeToRefs(authStore)
const sidebar = ref(false);
import { storeToRefs } from 'pinia'

const appTitle = 'magic';
const menuLoggedOut = [
  { title: 'Sign In', path: '/signin', icon: 'mdi-lock-open' },
  { title: 'Sign Up', path: '/signup', icon: 'mdi-exit-to-app' }];

const menuCommon = [
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Shopping Cart', path: '/shoppingcart', icon: 'mdi-cart-arrow-down' },
  { title: 'Logg Out', path: '/logout', icon: 'mdi-logout' }
];
const menuAdmin = [
  menuCommon[0],
  { title: 'User List', path: '/userlist', icon: 'mdi-format-list-bulleted-square' },
  ...menuCommon.slice(-2)
];


</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title>appTitle</v-toolbar-title>
    <v-spacer>{{ user }}</v-spacer>

    <div v-if="is_logged && user.role === 'admin'">
      <template v-for="item in menuAdmin">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
    </div>
    <div v-if="is_logged && !(user.role === 'admin')">
      <template v-for="item in menuCommon">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
    </div>
    <div v-if="!is_logged">
      <template v-for="item in menuLoggedOut">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
    </div>
  </v-app-bar>
</template>