import { ATTACHMENTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Attachment } from '@/models/attachment'

export interface IdResponse {
  data: Attachment
  errors: string[] | null
  status: 'success' | 'failed'
}

export const attachmentId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${ATTACHMENTS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        name: '',
        url: '',
        mimetype: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
