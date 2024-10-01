<script setup>
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from '@/stores/AuthStore'
const authStore = useAuthStore();
const { is_logged, loading, user } = storeToRefs(authStore)
import { storeToRefs } from 'pinia'

const props = defineProps({
  active_sidebar: Boolean,
  width: String
});

const appTitle = 'magic';
const logo = 'https://wilsonclinic.com/wp-content/uploads/2018/12/placeholder-logo-2.png'

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
  { title: 'Add product', path: 'products/create', icon: 'mdi-package-variant-plus' },

  ...menuCommon.slice(-2)
];


</script>
<template>
  <v-app-bar prominent>
    <v-app-bar-nav-icon :height="props.width" @click.stop="$emit('toggle')"></v-app-bar-nav-icon>
    <!-- <v-toolbar-title class="d-none d-sm-inline-flex">appTitle</v-toolbar-title> -->
    <v-avatar :tile="true">
      <v-img alt="Avatar" :src="logo">
      </v-img>
    </v-avatar>
    <v-spacer></v-spacer>
    <text class="d-none d-sm-block">{{ !Object.is(user.name, undefined) ? user.name + "<->" + user.role : "" }}</text>
    <v-spacer></v-spacer>
    <div class="d-xs-inline-block border-md">
      <template v-if="is_logged && user.role === 'admin'" v-for="item in menuAdmin">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
      <template v-for="item in menuCommon" v-if="is_logged && !(user.role === 'admin')">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
      <template v-for="item in menuLoggedOut" v-if="!is_logged">
        <router-link :to="item.path">
          <v-btn icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </router-link>
      </template>
    </div>
  </v-app-bar>
</template>