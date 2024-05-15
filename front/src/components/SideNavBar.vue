<template>
  <div class="caja1"></div>
  <v-card class="custom-side-bar">
    <v-layout>
      <v-navigation-drawer
      v-model="props.active_sidebar"
      image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      theme="dark"
      temporary
      >
        <v-list nav>
          <div>
            <v-list-item>
            <v-btn icon class="custom-side-bar__icon" @click.stop="$emit('toggle')">

              <v-icon>mdi-menu-close</v-icon>
            </v-btn>
          </v-list-item>
            <v-spacer></v-spacer>

          </div>
          <v-list-item prepend-icon="mdi-email" title="Inbox" value="inbox"></v-list-item>
          <v-list-item prepend-icon="mdi-account-supervisor-circle" title="Supervisors"
            value="supervisors"></v-list-item>
          <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 250px"></v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
const props = defineProps({active_sidebar:Boolean});
</script>
<style scoped>
.custom-side-bar {

  background-color: blue;
  /* border: 2px solid cyan; */
  z-index: 2000;
  transition: all 10;
  /* transition: 200ms linear 50ms; */

/* Global values */
/* transition: inherit; */
}

.custom-side-bar__icon {
  display: relative;
  transform: rotate(180deg);
  position: absolute;
  right: 0;
  align-items:'end';
  z-index: 100;
}

/* .caja1{
  background-color: blue;
  width: 500px;
  height: 500px;
  border: 2px solid red; 
  position: absolute;
} */
</style>