import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Role } from '@/models/role'

const ME_PATH = USERS_PATH + 'me'

export interface MeResponse {
  data: {
    state: string
    email: string
    name: string
    lastname: string
    role: Role
  }
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userMe = async (): Promise<MeResponse> => {
  try {
    const response = await api().get<MeResponse>(ME_PATH)
    return response.data
  } catch (error) {
    return {
      data: {
        state: '',
        email: '',
        name: '',
        lastname: '',
        role: { id: 0, name: '', description: '', permissions: [], is_custom: false },
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
