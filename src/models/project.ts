import type { Article } from './article'

export interface Project {
  project: {
    id: number
    name: string
    description?: string
    remote_url: string
    user_id: number
  }
  content?: Article[]
}
