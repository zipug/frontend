import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Bot } from '@/models/bot'

export interface IdResponse {
  data: Bot
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${BOTS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        project_id: 0,
        name: '',
        description: '',
        state: '',
        api_token: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
