<template>
  <Card :card="{
    image: local_or_ext(props.product.coverImage),
    title: props.product.name,
    description: props.product.description,
    actions: props.product.actions
  }" />
</template>
<script setup>
import Card from '@/components/Card.vue'
const env = import.meta.env;

const props = defineProps({
  product: Object,
  
})
const local_or_ext=(link)=>{
  if(link.startsWith("product")){
    link = env.VITE_API_URL+"/"+link
  }
  else if(!link.startsWith("http")){
    link='https://www.educaciontrespuntocero.com/wp-content/uploads/2020/04/mejores-bancos-de-imagenes-gratis.jpg'
  }
  return link
}
</script>