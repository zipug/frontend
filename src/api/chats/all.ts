import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Chat } from '@/models/chat'

const ALL_PATH = CHATS_PATH + 'all'

export interface AllResponse {
  data: Chat[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatAll = async (): Promise<AllResponse> => {
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
