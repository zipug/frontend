import { ARTICLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Article } from '@/models/article'

const ALL_PATH = ARTICLES_PATH + 'all'

export interface AllResponse {
  data: Article[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const articleAll = async (): Promise<AllResponse> => {
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
