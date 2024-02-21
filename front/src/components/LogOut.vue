<template>
</template>
<script setup>
// import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/AuthStore'
const authStore = useAuthStore();
authStore.$logout();
</script>