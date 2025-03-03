import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Bot } from '@/models/bot'

const ALL_PATH = BOTS_PATH + 'all'

export interface AllResponse {
  data: Bot[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botAll = async (): Promise<AllResponse> => {
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
