import { ROLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Role } from '@/models/role'

export interface IdResponse {
  data: Role
  errors: string[] | null
  status: 'success' | 'failed'
}

export const roleId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${ROLES_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        id: 0,
        name: '',
        description: '',
        permissions: [],
        is_custom: false,
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
