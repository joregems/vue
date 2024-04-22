<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorPros }">
      {{ user.uuid }}
      <ul id="example-1">
        <li v-for="user_ in users">
          <div>
            <div v-for="it in user_">
              {{ !(typeof it === 'object') ? it : '' }}
            </div>
            <v-icon @click="() => { userStore.$delete(user_) }">mdi-trash-can</v-icon>
            <v-icon :="activatorPros" @click="cli(user_)">mdi-pencil</v-icon>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:default="{ isActive }">
      <GenericForm @close="isActive.value = false" :obj="add_fields(user,fields_to_add)" submitName="update" :adapter="custom_adapter"
        :submit="userStore.$update" />
    </template>
  </v-dialog>
</template>
<script>
import GenericForm from '@/components/GenericForm.vue'
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia'
</script>
<script setup>
const userStore = useUserStore();
const { users, user } = storeToRefs(userStore);
const custom_adapter = userStore.$get_adapter();
custom_adapter["email"]["disabled"] = true;
const fields_to_add=[]

const add_fields=(user_, fields_)=>{
  fields_.forEach(element => {
    user_[element]='';
  });
  return user_;
}

const cli = (ob) => {
  userStore.$set_user(ob);
}
await userStore.$get_users().catch((error) => { console.log(error) });


</script>