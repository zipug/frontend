<script setup lang="ts">
import RoleCreateForm from '@/components/RoleForm.vue'
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">Создание роли</span>
        </span>
      </template>
      <template #content>
        <div class="space-y-4">
          <RoleCreateForm />
        </div>
      </template>
    </Card>
  </div>
</template>
