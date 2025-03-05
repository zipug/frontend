import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Chat } from '@/models/chat'

export interface IdResponse {
  data: Chat[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${CHATS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
