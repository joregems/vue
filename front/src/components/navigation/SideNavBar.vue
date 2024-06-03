<template>
  <v-navigation-drawer v-model="child_active_sidebar" image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    theme="dark" temporary>
    <v-list nav>
      <div>
        <v-list-item>
          <v-btn icon class="custom-side-bar__icon" @click.stop="$emit('toggle', !child_active_sidebar)">

            <v-icon>mdi-menu-close</v-icon>
          </v-btn>
        </v-list-item>
        <v-spacer></v-spacer>

      </div>
      <v-list-item prepend-icon="mdi-email" title="placeholder" value="inbox"></v-list-item>
      <v-list-item prepend-icon="mdi-account-supervisor-circle" title="placeholder" value="supervisors"></v-list-item>
      <v-list-item prepend-icon="mdi-clock-start" title="placeholder" value="clockin"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { ref, watch } from 'vue';
import { defineEmits } from 'vue';
const props = defineProps({ active_sidebar: Boolean });
const child_active_sidebar = ref(props.active_sidebar);
const emit = defineEmits(['toggle'])

watch(() => props.active_sidebar, (new_active_sidebar, old_active_sidebar) => {
  child_active_sidebar.value = new_active_sidebar;
})

watch(child_active_sidebar, (new_child_active_sidebar, old_child_active_sidebar) => {
  if (!new_child_active_sidebar&&old_child_active_sidebar){
    emit('toggle', new_child_active_sidebar)

  }
 })
</script>
<style scoped>
.custom-side-bar {
  border: 2px solid red;

  /* background-color: red;
  z-index: 2000;
  transition: all 10;
  transition: 200ms linear 50ms; */
}

.custom-side-bar__icon {
  display: relative;
  transform: rotate(180deg);
  position: absolute;
  right: 0;
  align-items: 'end';
  z-index: 100;
}

</style>