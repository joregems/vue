<template>
  <v-card class="mx-auto" max-width="400">
    <v-img :src="card.image" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
    </v-img>
    <v-card-title>
      <h2 class="text-h4">{{card.tittle}}</h2>
      <v-spacer></v-spacer>
      <span class="text-h6">{{"$"+card.price}}</span>
    </v-card-title>
    <v-card-text>
      {{card.description}}
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <slot name="footer"></slot>
    <v-card-actions>
      <v-btn color="deep-purple-accent-4" :text="card.actions[0]['label']" variant="flat" @click.stop="card.actions[0]['function']" block></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  card: Object
})

const card = props.card
const sizes = [
  '04',
  '06',
  '08',
  '10',
  '12',
  '14',
]

const selection = ref('08')
</script>

<script>
export default {
  data: () => ({
    selection: '08',
    sizes: [
      '04', '06', '08', '10', '12', '14',
    ],
  }),
}
</script>
<style scoped>
  .v-img{
    aspect-ratio: 16/9;
    object-fit: cover;
    width:"100%";
    height:"100%";
  }
</style>