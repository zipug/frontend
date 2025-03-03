import { BOTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const UPDATE_PATH = BOTS_PATH + 'update'

export interface UpdateData {
  id: number
  project_id: number
  name: string
  description?: string
  api_token: string
}

export interface UpdateResponse {
  data: {
    id: 0
    project_id: 0
    name: ''
    description: ''
    state: ''
    api_token: ''
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const botUpdate = async (data: UpdateData): Promise<UpdateResponse> => {
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
        state: '',
        api_token: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
