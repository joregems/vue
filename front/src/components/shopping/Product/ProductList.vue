<template>
  <div class="product-list-container">
    <template v-for="product in products" :key="product.uuid">
      <div class="product-item" :class="'a'">
        {{ console.log(products_in_shopping_cart) }}
        <ProducItem :product='{
          ...product,
          actions: [{
            icon: "mdi-minus", label: "Add to cart", function: () => cli({ productUuid: product.uuid })
          }]
        }'>
        </ProducItem>
      </div>
    </template>
  </div>
</template>

<script>
import ProducItem from '@/components/shopping/Product/ProducItem.vue'
import { useProductStore } from '@/stores/ProductStore';
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
</script>
<script setup>
// useInterceptors(axios);
const productStore = useProductStore();
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(productStore);
const { products:products_in_shopping_cart } = shoppingCartStore.$get_products()
const cli = (ob) => {
  shoppingCartStore.$add_product(ob).catch((error) => {
    console.log(error)

  })
}
await productStore.$get_products_from_api().then(() => { }, (error) => { console.log(error); })
</script>

<style scoped>
.product-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 5em;
}

</style>