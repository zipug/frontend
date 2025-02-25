import { ARTICLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Article } from '@/models/article'

export interface IdResponse {
  data: Article
  errors: string[] | null
  status: 'success' | 'failed'
}

export const articleId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${ARTICLES_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        name: '',
        description: '',
        content: '',
        project_id: 0,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
