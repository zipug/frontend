import { PROJECTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const CREATE_PATH = PROJECTS_PATH + 'create'

export interface CreateData {
  name: string
  description?: string
  remote_url: string
}

export interface CreateResponse {
  data: number
  errors: string[] | null
  status: 'success' | 'failed'
}

export const projectCreate = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const response = await api().post<CreateResponse>(CREATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: 0,
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
