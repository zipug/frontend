import { botAll } from '@/api/bots/all'
import { botCreate, type CreateData } from '@/api/bots/create'
import { botDelete } from '@/api/bots/delete'
import { botId } from '@/api/bots/id'
import { botRun } from '@/api/bots/run'
import { botStop } from '@/api/bots/stop'
import { botUpdate, type UpdateData } from '@/api/bots/update'
import type { Bot } from '@/models/bot'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBotsStore = defineStore('bots', () => {
  const bots = ref<Bot[] | null>([])

  const getBots = computed<Bot[] | null>(() => bots.value)

  async function getAllBots() {
    try {
      const resp = await botAll()
      const botArray = resp.data
      bots.value = botArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getBotById(id: number): Promise<Bot | null> {
    try {
      const resp = await botId(id)
      return resp.data as Bot
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function runBotById(id: number): Promise<boolean> {
    try {
      const resp = await botRun(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearBots()
      await getAllBots()
    }
  }

  async function stopBotById(id: number): Promise<boolean> {
    try {
      const resp = await botStop(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearBots()
      await getAllBots()
    }
  }

  async function deleteBotById(id: number): Promise<boolean> {
    try {
      const resp = await botDelete(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearBots()
      await getAllBots()
    }
  }

  async function createBot(data: CreateData): Promise<boolean> {
    try {
      const resp = await botCreate(data)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearBots()
      await getAllBots()
    }
  }

  async function updateBotById(data: UpdateData): Promise<Bot | null> {
    try {
      const resp = await botUpdate(data)
      return resp.data as Bot
    } catch (err) {
      console.error(err)
      return null
    } finally {
      clearBots()
      await getAllBots()
    }
  }

  function clearBots() {
    bots.value = []
  }

  return {
    getAllBots,
    getBotById,
    clearBots,
    runBotById,
    stopBotById,
    deleteBotById,
    createBot,
    updateBotById,
    getBots,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBotsStore, import.meta.hot))
  console.log(`🍍 "${useBotsStore.$id}" store successfully loaded`)
}
