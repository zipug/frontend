<script setup lang="ts">
import UserProfileCreateForm from '@/components/UserProfileCreateForm.vue'
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">Создание пользователя</span>
        </span>
      </template>
      <template #content>
        <div class="mt-4">
          <UserProfileCreateForm />
        </div>
      </template>
    </Card>
  </div>
</template>
