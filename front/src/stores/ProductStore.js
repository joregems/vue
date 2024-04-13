import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios';
import { useInterceptors } from '@/axios';

useInterceptors(axios);


// export const product_adapter = {
//   "email": { type: 'text', icon: 'mdi-email' },
//   "password": { type: 'password', icon: 'mdi-key' },
//   "name": { type: 'text', icon: 'mdi-face-man' },
//   "role": { type: 'options', icon: '', items: ['admin', 'product'] },
// }

export const useProductStore = defineStore('productStore', () => {
  const products = ref([]);
  const product = ref({});

  async function $get_products() {
    const response = await axios.get('products');
    products.value = response.data
    return response.data;
  }
  function $get_adapter() {
    return product_adapter;
  }

  function $set_product(product_) {
    product.value = product_;
  }
  async function $update(product_) {
    const url = 'products' + '/' + product_.uuid;
    return axios.put(url, product_).then(async (response) => {
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  async function $delete(product_) {
    const url = 'products' + '/' + product_.uuid;
    return axios.delete(url, product_).then(async (response) => {
      product.value={}
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  return { product, products, $get_adapter, $set_product, $get_products, $delete, $update }
})