<template>
  {{  }}
  <v-card v-if="!(typeof card==='undefined')" class="mx-auto" max-width="344">
    <v-img :src="card.image" class="align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
      <v-card-title class="text-white" v-text="card.title"></v-card-title>
    </v-img>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="surface-variant" :icon="card.action.icon" size="small" variant="text" @click="card.action.function"></v-btn>

      <!-- <v-btn color="surface-variant" icon="mdi-bookmark" size="small" variant="text"></v-btn> -->

      <!-- <v-btn color="surface-variant" icon="mdi-share-variant" size="small" variant="text"></v-btn> -->
    </v-card-actions>

  </v-card>
</template>
<script>
export default {
  data: () => ({
    show: false,
  }),
}
</script>
<script setup>
const props = defineProps({
  card: Object
})

const card = props.card
// {
//   image:"https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
//   title:"Example"

// }
</script>