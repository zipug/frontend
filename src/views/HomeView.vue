<script lang="ts" setup>
import AdminDashboard from '@/components/AdminDashboard.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const user = computed(() => authStore.getUserData)
</script>

<template>
  <AdminDashboard v-if="user?.role?.name === 'admin'" />
</template>
