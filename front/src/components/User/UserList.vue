<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorPros }">
      {{ user.uuid }}
      <ul id="example-1">
        <li v-for="item in users">
          <div>
            <div v-for="it in item">
              {{ it }}
            </div>
            <v-icon @click="()=>{userStore.$delete(item)}">mdi-trash-can</v-icon>
            <v-icon :="activatorPros" @click="cli(item)">mdi-pencil</v-icon>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:default="{ isActive }">
      <GenericForm @close="isActive.value = false"
        :obj="user" submitName="update"
        :adapter="custom_adapter"
        :submit="userStore.$update" />
    </template>
  </v-dialog>
</template>

<script>
import GenericForm from '@/components/GenericForm.vue'
import axios from '@/axios';
import { useInterceptors } from '@/axios';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia'

</script>
<script setup>
useInterceptors(axios);
const userStore = useUserStore();
const { users, user } = storeToRefs(userStore);
const custom_adapter=userStore.$get_adapter();
custom_adapter["email"]["disabled"]=true;
const cli = (ob) => {
  userStore.$set_user(ob);
}
await userStore.$get_users();

</script>