import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosInterceptors as axios } from '@/axios';

export const product_adapter = {
  "name": { type: 'text', icon: 'mdi-arrow-down-circle-outline', label: 'nombre del producto' },
  "description": { type: 'text', icon: 'mdi-arrow-down-circle-outline', label: 'descripción del producto' },
  "sku": { type: 'text', icon: 'mdi-arrow-down-circle-outline', label: 'sku' },
  "categoryId": { type: 'text', icon: 'mdi-arrow-down-circle-outline', label: 'blebleble' },
  "price": { type: 'text', icon: 'mdi-arrow-down-circle-outline', label: 'precio del producto' },
  "coverImage": { type: 'file', icon: '', label: 'seleccione una imagen' }
};

export const useProductStore = defineStore('productStore', () => {
  const products = ref({});
  const product = ref({});

  const check_image = (value) => {
    value = Object.is(value, null) ? [''] : value;
    value = typeof value === 'object' ? value[0] : value;
    return value;
  }
  async function $create_product(obj) {
    const forme = new FormData();
    forme.append('coverImage', check_image(obj.coverImage));
    forme.append('name', obj.name);
    forme.append('description', obj.description);
    forme.append('sku', obj.sku);
    forme.append('categoryId', obj.categoryId);
    forme.append('price', obj.price);
    return axios.post('products', forme)
      .then((response) => {
        return response;
      })
      .catch((error) => { throw error })
  }

  async function $get_products_from_api() {
    return await axios.get('products')
      .then(
        (response) => {
          const dictionary_products = Object.assign({}, ...response.data.map((x) => ({ [x.uuid]: x })));
          products.value = dictionary_products;
          return;
        }, (error) => {
          console.log(error);
          throw error;
        })
  }

  async function $get_products_from_api() {
    return await axios.get('products')
      .then(
        (response) => {
          const dictionary_products = Object.assign({}, ...response.data.map((x) => ({ [x.uuid]: x })));
          products.value = dictionary_products;
          return;
        }, (error) => {
          console.log(error);
          throw error;
        })
  }
  function $get_adapter() {
    return JSON.parse(JSON.stringify(product_adapter));
  }

  function $set_product(product_) {
    product.value = product_;
  }
  async function $update(product_) {
    const url = 'products' + '/' + product_.uuid;
    return axios.put(url, product_).then(async (response) => {
      await $get_products_from_api();
      return response;
    }, (error) => { throw error });
  }
  async function $delete(product_) {
    const url = 'products' + '/' + product_.uuid;
    return axios.delete(url, product_).then(async (response) => {
      product.value = {};
      await $get_products_from_api();
      return response;
    }, (error) => { throw error });
  }
  return { product, products, $get_adapter, $set_product, $create_product, $get_products_from_api, $delete, $update }
})