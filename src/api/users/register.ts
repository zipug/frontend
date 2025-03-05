import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { LoginResponse } from '@/api/users/login.ts'

export interface RegisterData {
  email: string
  name: string
  lastname: string
  password: string
  repeat_password: string
}

export const userRegister = async (data: RegisterData, path: string): Promise<LoginResponse> => {
  try {
    const response = await api().post<LoginResponse>(`${USERS_PATH}${path}`, data)
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
