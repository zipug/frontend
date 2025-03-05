import { chatAll } from '@/api/chats/all'
import { chatTelegramUser, type TgUserRequest } from '@/api/chats/get_tg_user'
import { chatId } from '@/api/chats/id'
import { chatSend, type SendRequest } from '@/api/chats/send_message'
import type { Chat } from '@/models/chat'
import type { TelegramUser } from '@/models/telegram'
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

  async function getChatById(id: number): Promise<Chat[] | null> {
    try {
      const resp = await chatId(id)
      return resp.data as Chat[]
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function getTelegramUser(data: TgUserRequest): Promise<TelegramUser | null> {
    try {
      const resp = await chatTelegramUser(data)
      return resp.data as TelegramUser
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function sendMessage(data: SendRequest): Promise<boolean> {
    try {
      const resp = await chatSend(data)
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
    getTelegramUser,
    sendMessage,
    getChats,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatsStore, import.meta.hot))
  console.log(`🍍 "${useChatsStore.$id}" store successfully loaded`)
}
