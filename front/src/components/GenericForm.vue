<template>
  <v-sheet width="300" class="mx-auto">
    <v-form @submit.prevent="() => {
      submit(obj, ()=>$emit('close'));
      }">
      <div v-for="key in Object.keys(adapter)">
        <div v-if="adapter[key]['type'] == 'options'">
          <v-select :type="adapter[key]['type']" variant="solo"
          :prepend-inner-icon="adapter[key]['icon']"
            v-model="obj[key]" :disabled="adapter[key]['disabled']"
            :label="key" :items="adapter[key].items"
            :error-messages="errors[key]"
            ></v-select>
        </div>
        <div v-else>
          <v-text-field :type="adapter[key]['type']" variant="solo"
          :prepend-inner-icon="adapter[key]['icon']"
            v-model="obj[key]" :disabled="adapter[key]['disabled']"
            :label="key":error-messages="errors[key]"
            ></v-text-field>
        </div>
      </div>
      <v-btn type="submit" block class="mt-2">{{ submitName }}</v-btn>

    </v-form>
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
const submitName = props.submitName ?? "Submit";
const adapter = props.adapter;
onBeforeMount(() => {
  obj.value = { ...props.obj };
})

async function submit(obj, emit_ps) {
  const err_to_arr = (arr) => {
    const respons_arr = {};
    arr.forEach(element => {
      try{
      respons_arr[element.path].push(element.message)
      }
      catch{
      respons_arr[element.path]=[element.message]
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
      errors.value = [];
      try {
        errors.value = err_to_arr(error.response.data);
      }
      catch (err) {
        errors.value = err_to_arr(error.response.data.error.errors);
      }
    })
}

</script>