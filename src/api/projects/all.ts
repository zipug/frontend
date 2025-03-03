import { PROJECTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Project } from '@/models/project'

const ALL_PATH = PROJECTS_PATH + 'all'

export interface AllResponse {
  data: Project[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const projectAll = async (): Promise<AllResponse> => {
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
