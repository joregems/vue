<template>
  <div id="example-1">
    <div v-for="item in products" :key="item.uuid">
      <br>
      <div>
          <Card :card="{image:'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
          title:item.name, action:{icon:'mdi-minus',
          function:async ()=>{
            await shoppingCartStore.$delete_product(item);
            }}}" />
      </div>
    </div>
  </div>
</template>

// <script setup>
import Card from '@/components/Card.vue'
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
import { print_error } from '@/utilities/print_error'
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(shoppingCartStore);

await shoppingCartStore.$get_products().catch((error) => { print_error(error) });


</script>