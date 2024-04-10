<template>
  {{ product.uuid }}
  <ul id="example-1">
    <li v-for="item in products">
      <div>
        <div v-for="it in item">
          {{ it }}
        </div>
        <v-icon @click="() => { productStore.$delete({productUuid:item.uuid,cantidad:6}) }">mdi-minus</v-icon>
        <v-icon @click="cli({productUuid:item.uuid,cantidad:6})">mdi-plus</v-icon>
      </div>
    </li>
  </ul>
</template>

<script>
import axios from '@/axios';
import { useInterceptors } from '@/axios';
import { useProductStore } from '@/stores/ProductStore';
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
import { print_error } from '@/utilities/print_error'
</script>
<script setup>
useInterceptors(axios);
const productStore = useProductStore();
const shoppingCartStore = useShoppingCartStore();

const { products, product } = storeToRefs(productStore);
const cli = (ob) => {
  shoppingCartStore.$add_product(ob);
}
await productStore.$get_products().catch((error) => { print_error(error) });


</script>