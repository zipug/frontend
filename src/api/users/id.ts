import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Role } from '@/models/role'

interface User {
  id: number
  state: string
  email: string
  name: string
  lastname: string
  role: Role
}

export interface IdResponse {
  data: User
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${USERS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        state: '',
        email: '',
        name: '',
        lastname: '',
        role: {
          id: 0,
          name: '',
          description: '',
          permissions: [],
          is_custom: false,
        },
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
