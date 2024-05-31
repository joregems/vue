<template>
  <div class="state_container">
    <v-img :src="shopping_bag" :width="200" alt="Shopping bag" />
    <span>Begin a shopping cart!</span>
    <span>
      <router-link to="/">
        <v-btn>
          Discover products
        </v-btn>
      </router-link>
    </span>
  </div>
</template>
<script setup>
import shopping_bag from '@/assets/shopping_bag.svg';

</script>

<style scoped>
.state_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>