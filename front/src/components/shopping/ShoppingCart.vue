<template>
  {{ "blebleble" }}
  <ul id="example-1">
    <li v-for="item in products">
      <div>
        <div v-for="it in item">
          {{ it }}
        </div>
        <v-icon @click="() => { shoppingCartStore.$delete_product(item) }">mdi-minus</v-icon>
        <v-icon @click="cli(item)">mdi-plus</v-icon>
      </div>
    </li>
  </ul>
</template>

// <script setup>
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
import { print_error } from '@/utilities/print_error'
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(shoppingCartStore);

await shoppingCartStore.$get_products().catch((error) => { print_error(error) });


</script>