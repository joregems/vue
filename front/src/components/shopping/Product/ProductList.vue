<template>
  <div class="product-list-container">
    <template v-for="product in products" :key="product.uuid">
      <div class="product-item">
        <ProductItem :class="products_in_shopping_cart.some(e => e.uuid === product.uuid)?'in_shopping_cart':''"
        :product='{
          ...product,
          actions: [{
            icon: "mdi-minus", label: "Add to cart", function: () => cli({ productUuid: product.uuid })
          }]
        }'>
        </ProductItem>
      </div>
    </template>
  </div>
</template>

<script>
import ProductItem from '@/components/shopping/Product/ProductItem.vue'
import { useProductStore } from '@/stores/ProductStore';
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
import { storeToRefs } from 'pinia'
</script>

<script setup>
const productStore = useProductStore();
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(productStore);
shoppingCartStore.$get_products();
const { products: products_in_shopping_cart } = storeToRefs(shoppingCartStore);
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
.in_shopping_cart {
  background-color: gainsboro;
}
</style>
