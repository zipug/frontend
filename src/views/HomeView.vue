<script lang="ts" setup>
import AdminDashboard from '@/components/AdminDashboard.vue'
import UserDashboard from '@/components/UserDashboard.vue'
import SupportDashboard from '@/components/SupportDashboard.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const user = computed(() => authStore.getUserData)
</script>

<template>
  <AdminDashboard v-if="user?.role?.name === 'admin'" />
  <UserDashboard v-if="user?.role?.name === 'user'" />
  <SupportDashboard v-if="user?.role?.name === 'support'" />
</template>
