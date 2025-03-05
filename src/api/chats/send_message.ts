import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const SEND_PATH = CHATS_PATH + 'send-message'

export interface SendRequest {
  id: number
  bot_id: number
  telegram_id: number
  message: string
}

export interface SendResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatSend = async (data: SendRequest): Promise<SendResponse> => {
  try {
    const response = await api().post<SendResponse>(SEND_PATH, data)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
