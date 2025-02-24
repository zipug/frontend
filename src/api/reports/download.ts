import { api } from '@/api/client.ts'
import { GENERATED_REPORTS_PATH } from '@/constants/api'

export const reportDownload = async (id: number): Promise<string> => {
  try {
    const response = await api().get<string>(`${GENERATED_REPORTS_PATH}${id}`)
    return response.data
  } catch (error) {
    return ''
  }
}
