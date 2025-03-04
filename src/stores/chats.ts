import { chatAll } from '@/api/chats/all'
import { chatId } from '@/api/chats/id'
import { chatResolve } from '@/api/chats/resolve'
import type { Chat } from '@/models/chat'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[] | null>([])

  const getChats = computed<Chat[] | null>(() => chats.value)

  async function getAllChats() {
    try {
      const resp = await chatAll()
      const ChatArray = resp.data
      chats.value = ChatArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getChatById(id: number): Promise<Chat | null> {
    try {
      const resp = await chatId(id)
      return resp.data as Chat
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function resolveChatById(id: number): Promise<boolean> {
    try {
      const resp = await chatResolve(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearChats()
      await getAllChats()
    }
  }

  function clearChats() {
    chats.value = []
  }

  return {
    getAllChats,
    getChatById,
    clearChats,
    resolveChatById,
    getChats,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatsStore, import.meta.hot))
  console.log(`🍍 "${useChatsStore.$id}" store successfully loaded`)
}
