import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Role } from '@/models/role'

const ALL_PATH = USERS_PATH + 'all'

interface User {
  id: number
  state: string
  email: string
  name: string
  lastname: string
  role: Role
}

export interface AllResponse {
  data: User[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userAll = async (): Promise<AllResponse> => {
  try {
    const response = await api().get<AllResponse>(ALL_PATH)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
