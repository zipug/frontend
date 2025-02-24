import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const UPDATE_PATH = USERS_PATH + 'update'

export interface UpdateData {
  id: number
  name: string
  lastname: string
  email: string
}

export interface UpdateResponse {
  data: {
    state: string
    email: string
    name: string
    lastname: string
    role: {} | null
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userUpdate = async (data: UpdateData): Promise<UpdateResponse> => {
  try {
    const response = await api().post<UpdateResponse>(UPDATE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        state: '',
        email: '',
        name: '',
        lastname: '',
        role: null,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
