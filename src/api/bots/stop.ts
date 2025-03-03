import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const STOP_PATH = BOTS_PATH + 'stop/'

export interface RunResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botStop = async (id: number): Promise<RunResponse> => {
  try {
    const response = await api().post<RunResponse>(`${STOP_PATH}${id}`, { state: 'stopped' })
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
