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
                <Avatar
                  image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                  shape="circle"
                />
                <span class="font-bold">Amy Elsner</span>
              </div>
            </template>
          </Panel>
          <pre>
            {{ JSON.stringify(chat, null, 2) }}
          </pre>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useChatsStore } from '@/stores/chats'
import { useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const chatsStore = useChatsStore()
const chat = ref()
const isLoading = ref(false)

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

onMounted(async () => {
  isLoading.value = true
  const { id } = route.params
  if (Number.isNaN(+id)) {
    router.push({ name: 'NotFound' })
    return
  }
  const resp = await chatsStore.getChatById(+id)
  chat.value = resp
  isLoading.value = false
})
</script>
