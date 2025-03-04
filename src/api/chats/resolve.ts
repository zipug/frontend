import { CHATS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const RESOLVE_PATH = CHATS_PATH + 'resolve'

export interface ResolveResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const chatResolve = async (id: number): Promise<ResolveResponse> => {
  try {
    const response = await api().post<ResolveResponse>(`${RESOLVE_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
