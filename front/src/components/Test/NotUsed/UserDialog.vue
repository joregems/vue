<!-- <template>
    <slot name="default">
    Fallback content
  </slot>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="surface-variant" text="Open Dialog" variant="flat"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Dialog">
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template> -->

<template>
  <!-- <v-sheet width="300" class="mx-auto">
    <div v-if="errors.length">
      {{ errors }}
    </div>
    <v-form @submit.prevent="submit">
      <div v-html="val"></div>
      <v-text-field type="password" variant="solo" prepend-inner-icon="mdi-key" v-model="user.password" label="Password"></v-text-field>
      <v-text-field type="text" variant="solo" prepend-inner-icon="mdi-face-man" v-model="user.name" label="Name"></v-text-field>
      <v-select type="select" variant="solo" prepend-inner-icon="" v-model="user.role" label="Role" :items="['admin', 'user']"></v-select>
      <v-btn type="submit" block class="mt-2">Sign Up</v-btn>
    </v-form>
  </v-sheet> -->
  <GenericForm submitName="update" :obj="user" :adapter="user_adapter"
  :submit="submit" />
</template>

<script>
import { ref } from 'vue';
import { onBeforeMount } from 'vue'
import { useUserStore } from '@/stores/UserStore';
import GenericForm from '@/components/GenericForm.vue';
import { user_adapter } from '@/stores/UserStore.js'

export default {
  inheritAttrs: false
}

</script>

<script setup>
const isActive = ref(true);
const userStore = useUserStore();
const errors = ref([]);

const props = defineProps({
  user: Object
})

const user = ref({})
onBeforeMount(() => {
  user.value = { ...props.user }
}
)

const submit = async (obj) => {
  await userStore.$update(obj);
  await userStore.$get_users();
}
</script>