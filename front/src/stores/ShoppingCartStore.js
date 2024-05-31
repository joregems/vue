import { ref } from 'vue'
import { defineStore } from 'pinia'
// import axios from '@/axios';
// import { useInterceptors } from '@/axios';
// useInterceptors(axios);
import { axiosInterceptors as axios } from '@/axios';

export const useShoppingCartStore = defineStore('shoppingCartStore', () => {
  const products = ref([]);
  const product = ref({});

  async function reset_product() {
    product.value = {};
  }
  // async function reset() {
  //   products.value = [];
  //   product.value = {};
  // }  

  async function $get_products() {
    const response = await axios.get('shoppingcart');
    products.value = response.data
    return response.data;
  }
  async function $add_product(product_) {
    product_['quantity'] = 1;
    return axios.post('shoppingcart/product', product_)
      .then(async (response) => {
        await $get_products();
        return response;
      }, (error) => { throw error });
  }
  function $set_product(product_) {
    product.value = product_;
  }
  async function $delete_product(product_) {
    const url = 'shoppingcart' + '/' + product_.uuid;
    return axios.delete(url, product_).then(async (response) => {
      // await reset_product();
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  async function $update_product(product_) {
    const url = '/shoppingcart/product/change_quantity';
    const product_to_send = { quantity: product_["quantity"], uuid: product_["uuid"] };
    return axios.put(url, product_to_send).then(async (response) => {
      await $get_products();
      return response;
    }, (error) => { throw error });
  }
  return { products, product, $update_product, $set_product, $get_products, $delete_product, $add_product }
})
