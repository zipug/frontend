import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Chat } from '@/models/chat'

export interface IdResponse {
  data: Chat
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${CHATS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        bot_id: 0,
        telegram_id: 0,
        project_id: 0,
        created_by: 0,
        user_id: 0,
        name: '',
        question: '',
        created_at: '',
        is_resolved: false,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
