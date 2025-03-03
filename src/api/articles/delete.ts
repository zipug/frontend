import { ARTICLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const DELETE_PATH = ARTICLES_PATH

export interface DeleteResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const articleDelete = async (id: number): Promise<DeleteResponse> => {
  try {
    const response = await api().delete<DeleteResponse>(`${ARTICLES_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
