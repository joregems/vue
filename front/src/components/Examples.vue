<template>
  {{ "NOOOOO" }}
  <Ex></Ex>
</template>
<script setup>
import { createApp } from 'vue'

const vueApp = createApp()
const modules = import.meta.glob('./examples/v-chip-group/*.vue')
function toCamelCase(text) {
  return text.replace(/-\w/g, clearAndUpper);
}

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}import {default as Ex} from './examples/v-chip/event-action-chips.vue';
</script>