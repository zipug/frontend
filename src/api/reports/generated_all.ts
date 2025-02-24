import { GENERATED_REPORTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { GeneratedReport } from '@/models/generated_report'

const ALL_PATH = GENERATED_REPORTS_PATH + 'all'

export interface GeneratedResponse {
  data: GeneratedReport[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const reportGeneratedAll = async (): Promise<GeneratedResponse> => {
  try {
    const response = await api().get<GeneratedResponse>(ALL_PATH)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
