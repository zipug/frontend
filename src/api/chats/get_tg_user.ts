import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { TelegramUser } from '@/models/telegram'

const USER_PATH = CHATS_PATH + 'tg-user'

export interface TgUserRequest {
  id: number
  bot_id: number
  telegram_id: number
}

export interface TgUserResponse {
  data: TelegramUser
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatTelegramUser = async (data: TgUserRequest): Promise<TgUserResponse> => {
  try {
    const response = await api().post<TgUserResponse>(USER_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        first_name: '',
        username: '',
        bio: '',
        photo_url: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
