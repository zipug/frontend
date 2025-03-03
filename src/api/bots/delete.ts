import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

export interface DeleteResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botDelete = async (id: number): Promise<DeleteResponse> => {
  try {
    const response = await api().delete<DeleteResponse>(`${BOTS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
