<template>
  <template v-if = "products.length<1">
  <EmptyShoppingCart />
  </template>
  <div class="product-list">
    <div v-for="product in products" :key="product.uuid">
      <br>
      <ProducItem :product="{
        ...product, actions: [{
          icon: 'mdi-minus', label: 'remove from shop cart', function: async () => {
            await shoppingCartStore.$delete_product(product);
          }
        }]
      }">
        <template v-slot:footer><ChangeQuantity :product="product"></ChangeQuantity></template>
      </ProducItem>
    </div>
  </div>
</template>

//
<script setup>
import ProducItem from '@/components/shopping/Product/ProducItem.vue'
import EmptyShoppingCart from '@/components/shopping/EmptyShoppingCart.vue'

import ChangeQuantity from '@/components/shopping/Product/ChangeQuantity.vue'
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(shoppingCartStore);
await shoppingCartStore.$get_products().catch((error) => { console.log(error) });

</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 5em;
}
</style>