<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <Card class="px-8">
    <template #header>
      <div class="px-4 mt-8">
        <span class="text-2xl font-medium text-green-500">| 404</span>
      </div>
    </template>
    <template #title>
      <div class="flex flex-col gap-6 mt-4">
        <span class="text-5xl font-bold">Страница не найдена</span>
        <span class="font-light text-zinc-300">Извините, мы не можем найти данную страницу</span>
        <Divider />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col justify-center gap-2">
        <SectionCard
          title="Главная"
          icon="pi pi-home"
          description="Метрики по основным разделам"
          color="bg-orange-500"
          @click="router.push('/')"
        />
        <SectionCard
          title="Проекты"
          icon="pi pi-list"
          description="Данные о созданных проектах"
          color="bg-violet-500"
          @click="router.push('/projects/all')"
        />
        <SectionCard
          title="Боты"
          icon="pi pi-telegram"
          description="Данные о созданных ботах и управление их состоянием"
          color="bg-blue-500"
          @click="router.push('/bots/all')"
        />
      </div>
    </template>
  </Card>
</template>
