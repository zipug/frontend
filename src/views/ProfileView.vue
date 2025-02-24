<script setup lang="ts">
import ProfileForm from '@/components/ProfileForm.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const initials = computed(() => authStore.getInitials)
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #header>
        <div class="flex justify-start pt-8 pl-4">
          <Avatar
            :label="initials"
            size="xlarge"
            shape="circle"
            class="mb-4"
            style="background-color: #ece9fc; color: #2a1261"
          />
        </div>
      </template>
      <template #title><span class="text-2xl">Профиль</span></template>
      <template #content>
        <div class="space-y-4">
          <ProfileForm />
        </div>
      </template>
    </Card>
  </div>
</template>
