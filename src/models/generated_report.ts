import type { Report } from './report'

export interface GeneratedReport {
  id: number
  user_id: number
  report_id: number
  date_from?: string
  date_to?: string
  object_id?: string
  content?: string | null
}

export interface GeneratedReportPayload {
  report: Report
  date_from?: string
  date_to?: string
}
