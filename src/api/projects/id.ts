import { PROJECTS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'
import type { Project } from '@/models/project'

export interface IdResponse {
  data: Project
  errors: string[] | null
  status: 'success' | 'failed'
}

export const projectId = async (id: number): Promise<IdResponse> => {
  try {
    const response = await api().get<IdResponse>(`${PROJECTS_PATH}${id}`)
    return response.data
  } catch (error) {
    return {
      data: {
        project: {
          id: 0,
          user_id: 0,
          name: '',
          description: '',
          remote_url: '',
        },
        content: [],
      },
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
