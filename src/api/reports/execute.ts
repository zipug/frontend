import { REPORTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { GeneratedReportPayload } from '@/models/generated_report'

const EXECUTE_PATH = REPORTS_PATH + 'execute'

export interface ExecuteResponse {
  errors: string[] | null
  status: 'success' | 'failed'
}

export interface ExecuteRequest {
  report_id: number
  date_from: string
  date_to: string
}

export const reportExecute = async (data: ExecuteRequest): Promise<ExecuteResponse> => {
  try {
    const response = await api().post<ExecuteResponse>(EXECUTE_PATH, data)
    return response.data
  } catch (error) {
    return {
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
