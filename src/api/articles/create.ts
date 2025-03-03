import { ARTICLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const CREATE_PATH = ARTICLES_PATH + 'create'

export interface CreateData {
  project_id: number
  name: string
  description: string
  content: string
}

export interface CreateResponse {
  data: {
    project_id: number
    name: string
    description: string
    content: string
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const articleCreate = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const response = await api().post<CreateResponse>(CREATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
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
