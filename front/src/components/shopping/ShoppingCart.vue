<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.uuid">
      <br>
        <ProducItem :product="{
          ...product, actions: [{
            icon: 'mdi-minus', function: async () => {
              await shoppingCartStore.$delete_product(product);
            }
          }]
        }">
        </ProducItem>
    </div>
  </div>
</template>

//
<script setup>
import ProducItem from '@/components/shopping/Product/ProducItem.vue'
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(shoppingCartStore);
await shoppingCartStore.$get_products().catch((error) => { console.log(error) });

</script>

<style scoped>
.product-list {
  /* position: absolute;
  width: 100%;
  left: 0;
  padding: 0 5vw;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 5em; */


  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2em; */
}
</style>