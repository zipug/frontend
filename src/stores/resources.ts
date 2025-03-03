import { RESOURCES_WS_URL } from '@/constants/api'
import type { Resources } from '@/models/resources'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useResourcesStore = defineStore('resources', () => {
  const resources = ref<Resources[] | null>([])

  const getResources = computed<Resources[] | null>(() => resources.value)

  function updateResources(event: any) {
    const data = JSON.parse(event.data)
    if (resources.value?.length && resources.value?.length > 24) {
      resources.value?.shift()
    }
    resources.value?.push(data)
    try {
    } catch (err) {
      console.error(err)
    }
  }

  function clearResources() {
    resources.value = null
  }

  return { updateResources, clearResources, getResources }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useResourcesStore, import.meta.hot))
  console.log(`🍍 "${useResourcesStore.$id}" store successfully loaded`)
}
