<template>
  <v-sheet width="300" class="mx-auto">
    <v-form enctype="multipart/form-data" @submit.prevent="() => {
      submit(obj, () => $emit('close'));
    }">
      <div v-for="key in intersection(Object.keys(obj),Object.keys(adapter))">
        <div v-if="adapter[key]['type'] == 'options'">
          <v-select :type="adapter[key]['type']" variant="solo" :prepend-inner-icon="adapter[key]['icon']"
            v-model="obj[key]" :disabled="adapter[key]['disabled']" :label="adapter[key]['label']" :items="adapter[key].items"
            :error-messages="errors[key]"></v-select>
        </div>
        <div v-else-if="adapter[key]['type'] == 'file'">
          <v-file-input type="file" :label="adapter[key]['label']" v-model="obj[key]" truncate-length="15">{{ key }}</v-file-input>
        </div>
        <div v-else>
          <v-text-field :type="adapter[key]['type']" variant="solo" :prepend-inner-icon="adapter[key]['icon']"
            v-model="obj[key]" :disabled="adapter[key]['disabled']" :label="adapter[key]['label']"
            :error-messages="errors[key]"></v-text-field>
        </div>
      </div>
      <v-btn type="submit" block class="mt-2">{{ submitName }}</v-btn>
    </v-form>
    <slot name="down"></slot>
  </v-sheet>
</template>

<script>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

export default {
  inheritAttrs: false
}


</script>
<script setup>
const errors = ref([]);
const props = defineProps({
  obj: Object,
  submitName: String,
  adapter: Object,
  submit: Function,
  errors: Array,
  callback: Function
})
const obj = ref({});
const adapter = props.adapter;
const submitName = props.submitName ?? "Submit";

const intersection=(arr1, arr2)=>{
  return arr1.filter(x => arr2.includes(x));
}


onBeforeMount(() => {
  obj.value = { ...props.obj };
})

async function submit(obj, emit_ps) {
  const err_to_arr = (arr) => {
    const respons_arr = {};
    arr.forEach(element => {
      try {
        respons_arr[element.path].push(element.message)
      }
      catch {
        respons_arr[element.path] = [element.message]
      }
      // respons_arr[element.path]=[...respons_arr[element.path],element.message]??[];
    });
    return respons_arr;
  }
  props.submit(obj).then(
    (response) => {
      errors.value = ["updated sucessfully"]
      try {
        emit_ps();
        props.callback();
      }
      catch {
      }
    },
    (error) => {
      console.log(error)
      errors.value = [];
      try {
        errors.value = err_to_arr(error.response.data.errors);
      }
      catch (err) {
        try {
          errors.value = err_to_arr(error.response.data);
        } catch (er) { }
      }
    })
}

</script>