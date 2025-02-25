<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Сгенерированные отчёты</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            :value="generated"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty>Сгенерированные отчёты не найдены </template>
            <template #loading>
              Загружаются сгенерированные отчёты. Пожалуйста подождите...
            </template>
            <Column field="object_id" header="Название" style="width: 40%"></Column>
            <Column field="date_from" header="Дата начала" style="width: 20%">
              <template #body="{ data }">
                <Tag :value="data.date_from" icon="pi pi-calendar" severity="primary" />
              </template>
            </Column>
            <Column field="date_to" header="Дата конца" style="width: 20%">
              <template #body="{ data }">
                <Tag :value="data.date_to" icon="pi pi-calendar" severity="primary" />
              </template>
            </Column>
            <Column header="Тип файла" sortable style="width: 20%">
              <template #body>
                <Chip label="csv" icon="pi pi-file-excel" />
              </template>
            </Column>
            <Column class="!text-end" style="width: 20%">
              <template #body="{ data }">
                <Button
                  icon="pi pi-download"
                  @click="selectRow(data)"
                  severity="secondary"
                  :disabled="!authStore.can('do_read:reports_feature')"
                  v-tooltip="'Скачать отчёт'"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'primevue'
import { onMounted, onUnmounted, ref } from 'vue'

const toast = useToast()
const reportsStore = useReportsStore()
const authStore = useAuthStore()
const reports = ref()
const generated = ref()
const isLoading = ref(false)
const selectRow = async (data: any) => {
  toast.add({
    severity: 'info',
    summary: 'Скачать отчёт',
    detail: `Отчёт для объекта ${data.object_id} будет скачан на ваш компьютер в ближайшее время`,
    life: 3000,
  })
  const resp = await reportsStore.download(+data.id)
  if (resp !== null) {
    const blob = new Blob([resp], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${data.object_id}.csv`
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    link.dispatchEvent(event)
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Отчёт ${data.object_id} скачан`,
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось скачать отчёт. Попробуйте позже',
    life: 5000,
  })
}

const strToDate = (str: string): string => {
  const date = new Date(str)
  return date?.toISOString()?.split('T')[0].split('-').reverse().join('.')
}

onMounted(async () => {
  isLoading.value = true
  await reportsStore.getAllReports()
  await reportsStore.getAllGeneratedReports()
  reports.value = reportsStore.getReports
  generated.value = reportsStore.getGeneratedReports
  generated.value = generated.value.map((item: any) => {
    return {
      ...item,
      date_from: strToDate(item.date_from),
      date_to: strToDate(item.date_to),
    }
  })
  isLoading.value = false
})
onUnmounted(() => {
  reportsStore.clearReports()
})
</script>
