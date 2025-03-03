import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const CREATE_PATH = BOTS_PATH + 'create'

export interface CreateData {
  project_id: number
  name: string
  description?: string
  api_token: string
}

export interface CreateResponse {
  data: {
    id: number
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botCreate = async (data: CreateData): Promise<CreateResponse> => {
  try {
    const response = await api().post<CreateResponse>(CREATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
