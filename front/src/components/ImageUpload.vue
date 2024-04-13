<template>
  <v-sheet width="300" class="mx-auto">
    <v-form enctype="multipart/form-data" @submit.prevent="() => {
      submit();
    }">
      <v-file-input type="file" v-model="file" truncate-length="15"></v-file-input>
      <v-btn type="submit" block class="mt-2">submit</v-btn>

    </v-form>
  </v-sheet>
</template>

<script setup>
import axios from '@/axios';
import { ref } from 'vue';
const file = ref(undefined)
async function submit() {
  const form = new FormData();
  form.append('image', file.value[0]);

  axios.post('uploadtest', form).then((response)=>{alert(response.data)}).catch((error)=>{console.log(error.response)})
  // await axios.post('uploadtest', file.value).then(alert("too good")).catch("cagaste")
}

</script>