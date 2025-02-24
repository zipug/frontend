import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { LoginResponse } from '@/api/users/login.ts'

const REGISTER_PATH = USERS_PATH + 'register'

export interface RegisterData {
  email: string
  name: string
  lastname: string
  password: string
  repeat_password: string
}

export const userRegister = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await api().post<LoginResponse>(REGISTER_PATH, data)
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
