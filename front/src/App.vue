<template>
  {{ active_sidebar }}
  <v-card>
    <v-layout>

      <v-app class="">
        <TopNavBar class="" width="80" :active_sidebar="active_sidebar"
          @toggle="() => {active_sidebar=false;active_sidebar=true}">
        </TopNavBar>

        <v-dialog v-model="conection_down" fullscreen full-width>
          waiting the server
          <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
            <v-layout justify-center align-center>
              <v-progress-circular indeterminate color="primary">
              </v-progress-circular>
            </v-layout>
          </v-container>
        </v-dialog>
        <v-main class="">
          <router-view />
        </v-main>
      </v-app>
      <SideNavBar :active_sidebar="active_sidebar" @toggle=" active_sidebar = $event">
      </SideNavBar>
    </v-layout>

  </v-card>

</template>

<!-- <template>
  <v-app class="">
    <v-card>
      <v-layout>
        <v-app-bar color="primary" prominent>
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>My files</v-toolbar-title>

          <v-spacer></v-spacer>

          <template v-if="$vuetify.display.mdAndUp">
            <v-btn icon="mdi-magnify" variant="text"></v-btn>

            <v-btn icon="mdi-filter" variant="text"></v-btn>
          </template>

          <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :location="undefined" temporary>
          <v-list :items="items"></v-list>
        </v-navigation-drawer>

        <v-main style="height: 500px;">
          <router-view />
        </v-main>
      </v-layout>
    </v-card>


  </v-app> 
</template>-->


<script setup>
import '@/normalize.css'
import TopNavBar from './components/TopNavBar.vue';
import SideNavBar from '@/components/SideNavBar.vue';
import { useRouter, RouterView } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css';
import { ref } from 'vue';
const router = useRouter();
// router.addRoute({ path: '/about2', component: HomeView })
const logo = "@/assets/logo.svg";
import { useAuthStore } from '@/stores/AuthStore';


const authStore = useAuthStore();
const active_sidebar = ref(false)
const reasignate =()=>{
  active_sidebar.value=true;
  

}
// router.addRoute({ path: '/about2', component: HomeView });
const conection_down = ref(true);

(async function my_func() {
  conection_down.value = await authStore.$is_down_conection()
  if (conection_down.value) {
    setTimeout(my_func, Math.random() * (12000 - 6000) + 6000);
  }
})();
</script>
<style>
/* .v-application__wrap {
  min-height: 0vh !important;
} */

/* body {
  overflow-x: hidden;
  border: 4px solid blueviolet;
  background-color: blueviolet;
  width: 100vw;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  scroll-behavior: smooth;
} */

#app {
  border: 4px solid rgb(90, 212, 9);
  background-color: rgb(17, 230, 163);
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
/* .full {
  overflow: hidden;

  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

} */
/* #app{
  position: absolute;
  display: flex;
  width: 100%;
  height: 20px;
  border: 2px solid chocolate;
  background-color: aqua;


} */
/* .content {
  overflow: hidden;
  overflow: hidden visible;
  border: 2px solid red;
  margin: 0;
  width: 100%;
  height: 100dvh;
} */
/* .full {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.caja1 {
  display: inline-block;
  width: 100%;
  height: auto;
  background-color: aqua;
  border: 4px solid saddlebrown;
}
.caja2 {
  display: inline-block;
  width: 100%;
  background-color: rgb(22, 204, 43);
  border: 8px solid saddlebrown;

} */
</style>
