import { reportAll } from '@/api/reports/all'
import { reportDownload } from '@/api/reports/download'
import { reportExecute, type ExecuteRequest } from '@/api/reports/execute'
import { reportGeneratedAll } from '@/api/reports/generated_all'
import type { GeneratedReport, GeneratedReportPayload } from '@/models/generated_report'
import type { Report } from '@/models/report'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useReportsStore = defineStore('reports', () => {
  const reports = ref<Report[] | null>([])
  const generated = ref<GeneratedReport[] | null>([])

  const getReports = computed<Report[] | null>(() => reports.value)
  const getGeneratedReports = computed<GeneratedReport[] | null>(() => generated.value)

  async function getAllReports() {
    try {
      const resp = await reportAll()
      const reportArray = resp.data
      reports.value = reportArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getAllGeneratedReports() {
    try {
      const resp = await reportGeneratedAll()
      const reportArray = resp.data
      generated.value = reportArray
    } catch (err) {
      console.error(err)
    }
  }

  async function download(id: number): Promise<string | null> {
    try {
      const resp = await reportDownload(id)
      return resp
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function execute(data: ExecuteRequest): Promise<boolean> {
    try {
      const resp = await reportExecute(data)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  function clearReports() {
    reports.value = []
    generated.value = []
  }

  return {
    getAllReports,
    clearReports,
    getAllGeneratedReports,
    download,
    execute,
    getReports,
    getGeneratedReports,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReportsStore, import.meta.hot))
  console.log(`🍍 "${useReportsStore.$id}" store successfully loaded`)
}
