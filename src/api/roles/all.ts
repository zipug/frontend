import { ROLES_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Role } from '@/models/role'

const ALL_PATH = ROLES_PATH + 'all'

export interface AllResponse {
  data: Role[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const roleAll = async (): Promise<AllResponse> => {
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
