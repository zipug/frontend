import { REPORTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Report } from '@/models/report'

const ALL_PATH = REPORTS_PATH + 'all'

export interface AllResponse {
  data: Report[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const reportAll = async (): Promise<AllResponse> => {
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
