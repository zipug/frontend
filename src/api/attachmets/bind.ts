import { ATTACHMENTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const BIND_PATH = ATTACHMENTS_PATH + 'bind'

export interface BindData {
  article_id: number
  attachment_id: number
}

export interface BindResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const attachmentBind = async (data: BindData): Promise<BindResponse> => {
  try {
    const response = await api().post<BindResponse>(BIND_PATH, data)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
