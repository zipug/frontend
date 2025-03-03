import { ARTICLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const UPDATE_PATH = ARTICLES_PATH + 'update'

export interface UpdateData {
  id: number
  project_id: number
  name: string
  description: string
  content: string
}

export interface UpdateResponse {
  data: {
    id: number
    project_id: number
    name: string
    description: string
    content: string
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const articleUpdate = async (data: UpdateData): Promise<UpdateResponse> => {
  try {
    const response = await api().post<UpdateResponse>(UPDATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        project_id: 0,
        name: '',
        description: '',
        content: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
