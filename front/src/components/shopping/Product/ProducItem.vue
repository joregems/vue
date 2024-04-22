<template>
  <Card :card="{
    image: local_or_ext(item.coverImage),
    title: item.name, action: {
      icon: 'mdi-minus',
      function: async () => {
        await shoppingCartStore.$delete_product(item);
      }
    }
  }" />
</template>
<script setup>
const props = defineProps({
  product: Object,
  
})
</script>