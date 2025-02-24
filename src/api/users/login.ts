import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const LOGIN_PATH = USERS_PATH + 'login'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    token: string
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userLogin = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api().post<LoginResponse>(LOGIN_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: {
        token: '',
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
