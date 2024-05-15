<template>
  <v-card v-if="!(typeof card === 'undefined')" class="mx-auto custom-vcard">
    <figure>
      <!-- class="align-end custom-image" -->

      <v-img
        :src="card.image"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
      </v-img>
        <figcaption class="text-white" v-text="card.title"></figcaption>
        <v-card-subtitle class="text-white" v-text="card.description"></v-card-subtitle>

    </figure>
    <v-card-actions>
      <v-spacer></v-spacer>
      <slot name="down">
        <template v-for="action in card.actions">
          <v-btn color="surface-variant" :icon="action.icon" size="small" variant="text"
            @click="action.function"></v-btn>
        </template>
      </slot>
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

<style scoped>

/* .custom-vcard {
  aspect-ratio: 16/9;


}
.custom-image {
  object-fit: cover;
  max-height: 40rem;
} */
</style>