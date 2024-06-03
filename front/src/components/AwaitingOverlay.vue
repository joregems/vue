<template>
  <v-dialog v-model="connection_down" fullscreen full-width>
    waiting the server
    <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout justify-center align-center>
        <v-progress-circular indeterminate color="primary">
        </v-progress-circular>
      </v-layout>
    </v-container>
  </v-dialog>
</template>
<script setup>
  const props = defineProps(['connection_down']);
  const connection_down = props.connection_down;
</script>