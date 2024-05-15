<template>
  <div class="product-list-container">
    <template v-for="product in products" :key="product.uuid">
      <div class="product-item">
        <ProducItem :product='{
          ...product,
          actions: [{
            icon: "mdi-minus", function: () => cli({ productUuid: product.uuid, cantidad: 1 })
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
const { products, product } = storeToRefs(productStore);
const cli = (ob) => {
  shoppingCartStore.$add_product(ob).catch((error) => {
    console.log(error)
  })
}
await productStore.$get_products_from_api().then(() => { }, (error) => { console.log(error); })

const chesss = (a) => {
  alert(a);
}
</script>

<style scoped>
.product-list-container {
  /* position: absolute;
  width: 100%;
  left: 0;
  padding: 0 5vw;
  box-sizing: border-box; */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 5em;
  /* grid-auto-rows: 200px; */
}

/* .product-item {
  border: 8px solid gray;

} */
</style>