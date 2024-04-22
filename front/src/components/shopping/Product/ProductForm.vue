<template>
  <GenericForm :obj="form" submitName="signup" :errors="errors"
    :adapter="product_adapter"
    :submit="productStore.$create_product" :callback="callback" />
</template>
<script setup>
import GenericForm from '@/components/GenericForm.vue';
import { ref } from 'vue';
import { useProductStore } from '@/stores/ProductStore';
import { product_adapter } from '@/stores/ProductStore';
import { useRouter } from 'vue-router';
const productStore = useProductStore();
const initial_form = {
  name: '',
  description: '',
  sku: '',
  // categoryId: '',
  price: '',
  coverImage: null
};
const form = ref(initial_form);
const router = useRouter();
const errors = ref([]);
const callback = () => {
  alert("Product has been created")
  location.reload()
}
</script>