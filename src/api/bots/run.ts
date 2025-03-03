import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const RUN_PATH = BOTS_PATH + 'run/'

export interface RunResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botRun = async (id: number): Promise<RunResponse> => {
  try {
    const response = await api().post<RunResponse>(`${RUN_PATH}${id}`, { state: 'running' })
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
