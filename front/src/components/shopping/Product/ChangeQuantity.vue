<template>
  <div class="quantity_change">
    <v-btn @click="down">-</v-btn>
    <v-text-field v-model="props.product.quantity" hide-details single-line />
    <v-btn @click="up">+</v-btn>
  </div>
</template>
<script setup>
import { useShoppingCartStore } from '@/stores/ShoppingCartStore';
const shopping_cart_store = useShoppingCartStore();

const props = defineProps({
  product: Object,
  change_quantity: Function
})

const up = () => {
  shopping_cart_store.$update_product({ ...props.product, quantity: props.product.quantity + 1 })
}

const down = () => {
  if (props.product.quantity > 1) {
    shopping_cart_store.$update_product({ ...props.product, quantity: props.product.quantity - 1 })
  }
}
</script>

<style scoped>
.v-text-field {
  width: 20px;
}

.quantity_change {
  width: 180px;
  display: flex;
  flex-wrap: nowrap;
}
.v-btn{
  height: 55px;
}
</style>