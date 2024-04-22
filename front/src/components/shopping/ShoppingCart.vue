<template>
  <div id="example-1">
    <div v-for="item in products" :key="item.uuid">
      <br>
      <div>
          <Card :card="{image:local_or_ext(item.coverImage),
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
const env = import.meta.env;
const shoppingCartStore = useShoppingCartStore();
const { products } = storeToRefs(shoppingCartStore);

const local_or_ext=(link)=>{
  if(link.startsWith("product")){
    link = env.VITE_API_URL+"/"+link
  }
  else if(!link.startsWith("http")){
    link='https://www.educaciontrespuntocero.com/wp-content/uploads/2020/04/mejores-bancos-de-imagenes-gratis.jpg'
  }
  return link
}

await shoppingCartStore.$get_products().catch((error) => { console.log(error) });


</script>