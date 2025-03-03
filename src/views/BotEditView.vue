<script setup lang="ts">
import BotForm from '@/components/BotForm.vue'
import { useBotsStore } from '@/stores/bots'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface botProps {
  isCreate: boolean
}

const props = defineProps<botProps>()

const router = useRouter()
const botStore = useBotsStore()
const route = useRoute()
const bot = ref()

onMounted(async () => {
  const { id } = route.params
  if (!props.isCreate) {
    if (Number.isNaN(+id)) {
      router.push({ name: 'NotFound' })
      return
    }
    bot.value = await botStore.getBotById(+id)
  } else
    bot.value = {
      id: 0,
      name: '',
      description: '',
      icon: '',
      api_token: '',
      state: '',
      project_id: 0,
    }
})
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">{{ isCreate ? 'Создание бота' : 'Редактирование бота' }}</span>
        </span>
      </template>
      <template #content>
        <div class="space-y-4">
          <BotForm :bot="bot" :is-create="isCreate" />
        </div>
      </template>
    </Card>
  </div>
</template>
