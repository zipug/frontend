import { ATTACHMENTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Attachment } from '@/models/attachment'

const ALL_PATH = ATTACHMENTS_PATH + 'all'

export interface AllResponse {
  data: Attachment[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const attachmentAll = async (): Promise<AllResponse> => {
  try {
    const response = await api().get<AllResponse>(ALL_PATH)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
