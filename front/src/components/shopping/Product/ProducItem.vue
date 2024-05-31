<template>
  <Card :card="{
    image: local_or_ext(props.product.coverImage),
    title: props.product.name,
    price: props.product.price,
    description: props.product.description,
    actions: props.product.actions
  }">
    <template v-for="(slot, index) of Object.keys($slots)" :key="index" v-slot:[slot]>
      <slot :name="slot"></slot>
    </template>
  </Card>
</template>
<script setup>
import Card from '@/components/Card.vue'

const env = import.meta.env;

const props = defineProps({
  product: Object,

})
const local_or_ext = (link) => {
  if (link.startsWith("product")) {
    link = env.VITE_API_URL + "/" + link
  }
  else if (!link.startsWith("http")) {
    link = 'https://www.educaciontrespuntocero.com/wp-content/uploads/2020/04/mejores-bancos-de-imagenes-gratis.jpg'
  }
  return link
}
</script>