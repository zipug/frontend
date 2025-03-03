import { attachmentAll } from '@/api/attachmets/all'
import { attachmentBind, type BindData } from '@/api/attachmets/bind'
import { attachmentsDelete } from '@/api/attachmets/delete'
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

  async function deleteAttachmentById(id: number): Promise<boolean> {
    try {
      const resp = await attachmentsDelete(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  async function bindAttachmentById(article_id: number, attachment_id: number): Promise<boolean> {
    try {
      const data = { article_id: article_id, attachment_id: attachment_id } as BindData
      const resp = await attachmentBind(data)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  function clearAttachments() {
    attachments.value = []
  }

  return {
    getAllAttachments,
    getAttachmentById,
    deleteAttachmentById,
    bindAttachmentById,
    clearAttachments,
    getAttachments,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttachmentsStore, import.meta.hot))
  console.log(`🍍 "${useAttachmentsStore.$id}" store successfully loaded`)
}
