import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/axios';
import { useInterceptors } from '@/axios';
useInterceptors(axios);

export const useShoppingCartStore = defineStore('shoppingCartStore', () => {
  const products = ref([]);

  async function $get_products() {
    const response = await axios.get('shoppingcart');
    products.value = response.data
    return response.data;
  }
  async function $add_product(product_) {
    return axios.post('shoppingcartsdetails', product_)
    .then(async (response) => {
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  async function $delete_product(product_) {
    const url = 'shoppingcart' + '/' + product_.uuid;
    return axios.delete(url, product_).then(async (response) => {
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  return { products, $get_products,  $delete_product, $add_product }
})
