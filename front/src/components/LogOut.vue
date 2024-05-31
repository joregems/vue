<template>
</template>
<script setup>
import { useAuthStore } from '@/stores/AuthStore'
const authStore = useAuthStore();
authStore.$logout();
</script>