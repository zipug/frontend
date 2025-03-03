import type { Attachment } from './attachment'

export interface Article {
  id: number
  name: string
  description: string
  content: string
  project_id: number
  attachments?: Attachment[]
}
