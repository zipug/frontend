import { PROJECTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const UPDATE_PATH = PROJECTS_PATH + 'update'

export interface UpdateData {
  id: number
  name?: string
  description?: string
  remote_url?: string
}

export interface UpdateResponse {
  data: {
    id: number
    name: string
    description: string
    remote_url: string
    user_id: number
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const projectUpdate = async (data: UpdateData): Promise<UpdateResponse> => {
  try {
    const response = await api().post<UpdateResponse>(UPDATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        name: '',
        description: '',
        remote_url: '',
        user_id: 0,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
