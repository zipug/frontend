import { attachmentAll } from '@/api/attachmets/all'
import { attachmentId } from '@/api/attachmets/id'
import type { Attachment } from '@/models/attachment'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAttachmentsStore = defineStore('attachments', () => {
  const attachments = ref<Attachment[] | null>([])

  const getAttachments = computed<Attachment[] | null>(() => attachments.value)

  async function getAllAttachments() {
    try {
      const resp = await attachmentAll()
      const attachmentArray = resp.data
      attachments.value = attachmentArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getAttachmentById(id: number): Promise<Attachment | null> {
    try {
      const resp = await attachmentId(id)
      return resp.data as Attachment
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function clearAttachments() {
    attachments.value = []
  }

  return { getAllAttachments, getAttachmentById, clearAttachments, getAttachments }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttachmentsStore, import.meta.hot))
  console.log(`🍍 "${useAttachmentsStore.$id}" store successfully loaded`)
}
