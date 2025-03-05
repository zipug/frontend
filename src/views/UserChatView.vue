<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #header>
        <div class="mt-4">
          <span class="text-2xl font-medium">Чат</span>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <Panel>
            <template #header>
              <div class="flex items-center gap-2">
                <Avatar :image="tgUser?.photo_url" shape="circle" />
                <span class="font-bold"
                  >{{ tgUser?.first_name
                  }}{{ tgUser?.last_name ? ` ${tgUser?.last_name}` : '' }}</span
                >
                <span v-if="tgUser?.username" class="font-bold text-blue-500"
                  >@{{ tgUser?.username }}
                </span>
              </div>
            </template>
            <p class="m-0" v-if="tgUser?.bio">
              {{ tgUser?.bio }}
            </p>
          </Panel>
          <div class="flex items-center justify-center gap-4 flex-col mt-4">
            <div class="justify_between flex flex-row items-center">
              <div class="flex flex-row gap-4 items-center"></div>
            </div>
            <Message severity="info" class="w-full flex flex-row">
              <template #icon>
                <Avatar :image="tgUser?.photo_url" shape="circle" class="!p-0 !m-0" />
              </template>
              <div class="flex md:flex-row max-md:flex-col justify-between items-end ml-4">
                <span>{{ chat?.[0]?.question }}</span>
                <span class="text-neutral-500 text-nowrap">{{
                  prettyDate(chat?.[0]?.created_at)
                }}</span>
              </div>
            </Message>
            <i v-if="isResolved" class="pi pi-arrow-up" style="font-size: 1rem"></i>
            <Message v-if="isResolved" severity="secondary" class="w-full flex flex-row">
              <template #icon>
                <Avatar :label="authStore.getInitials" shape="circle" class="!p-2 !m-0" />
              </template>
              <div class="flex md:flex-row max-md:flex-col gap-2 justify-between items-end ml-4">
                <span>{{ chat?.[1]?.question }}</span>
                <span class="text-neutral-500 text-nowrap">{{
                  prettyDate(chat?.[1]?.created_at)
                }}</span>
              </div>
            </Message>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4 mt-4">
          <IftaLabel v-if="!isResolved">
            <Textarea id="answer" v-model="answer" autoResize fluid rows="5" cols="30" />
            <Message
              id="answer"
              severity="error"
              variant="simple"
              size="small"
              class="w-full flex flex-row"
              v-if="!isResolved && !answer"
            >
              Перед отправкой - напишите сообщение
            </Message>
            <label for="answer">Сообщение</label>
          </IftaLabel>
          <Button
            label="Ответить"
            @click="answerOnQuestion"
            v-if="!isResolved"
            :disabled="!isResolved && !answer"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useChatsStore } from '@/stores/chats'
import { useToast } from 'primevue'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const me = computed(() => authStore.getUserData)
const isResolved = computed(() => chat.value?.[0]?.is_resolved)
const chatsStore = useChatsStore()
const chat = ref()
const tgUser = ref()
const answer = ref('')
const isLoading = ref(false)

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}
const answerOnQuestion = async () => {
  isLoading.value = true
  const id = chat.value?.[0]?.id
  if (!id) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось отправить сообщение пользователю',
      life: 3000,
    })
    isLoading.value = false
    return
  }
  await chatsStore.sendMessage({
    id: id,
    bot_id: chat.value?.[0]?.bot_id,
    telegram_id: chat.value?.[0]?.telegram_id,
    message: answer.value,
  })
  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: 'Сообщение успешно отправлено',
    life: 3000,
  })
  chat.value = await chatsStore.getChatById(id)
  isLoading.value = false
}

const prettyDate = (str: string): string => {
  const date = str?.split('T')
  return date?.[0] + ' ' + date?.[1]?.split('.')?.[0]
}

watchEffect(async () => {
  const tg = await chatsStore.getTelegramUser({
    id: chat.value?.[0].id,
    bot_id: chat.value?.[0].bot_id,
    telegram_id: chat.value?.[0].telegram_id,
  })
  tgUser.value = tg
})

onMounted(async () => {
  isLoading.value = true
  const { id } = route.params
  if (Number.isNaN(+id)) {
    router.push({ name: 'NotFound' })
    return
  }
  chat.value = await chatsStore.getChatById(+id)
  isLoading.value = false
})
</script>

<style>
.p-message-content {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.p-message-text {
  width: 100%;
}
</style>
