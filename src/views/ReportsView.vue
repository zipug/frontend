<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Отчёты</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            :value="reports"
            :rows="reports?.length"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty> Отчёты не найдены </template>
            <template #loading> Загружаются отчёты. Пожалуйста подождите... </template>
            <Column field="name" header="Название" sortable style="width: 20%"></Column>
            <Column field="description" header="Описание" sortable style="width: 20%"></Column>
            <Column class="!text-end" style="width: 12.5%">
              <template #body="{ data }">
                <Button
                  icon="pi pi-file-excel"
                  @click="selectRow(data)"
                  severity="secondary"
                  :disabled="!authStore.can('do_update:reports_feature')"
                  v-tooltip="'Сгенерировать отчёт'"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
    <Dialog v-model:visible="isDialog" modal class="min-w-96">
      <template #header>
        <span class="font-bold whitespace-nowrap text-xl">Сгенерировать отчёт</span>
      </template>
      <div class="flex items-center gap-4 mb-4">
        <IftaLabel class="w-full">
          <Select
            class="w-full"
            id="report_name"
            v-model="executeReport.report"
            :options="reports"
            checkmark
            optionLabel="name"
            type="text"
          >
            <template #empty>Нет доступных отчётов для выбора</template>
            <template #option="slotProps">
              <div class="max-w-36">
                <span class="">
                  {{ slotProps.option.name }}
                </span>
              </div>
            </template>
          </Select>
          <Message
            v-if="form?.errors?.report?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ form?.errors?.report?.error?.message }}
          </Message>
          <label for="report_name" class="block text-sm font-medium text-gray-700">Отчёт</label>
        </IftaLabel>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <IftaLabel class="w-full">
          <DatePicker
            id="date_from"
            class="w-full"
            v-model="computedDate"
            selectionMode="range"
            manualImput="false"
            showIcon
            iconDisplay="input"
            fluid
          />
          <Message
            v-if="form?.errors?.report?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ form?.errors?.report?.error?.message }}
          </Message>
          <label for="date_from" class="block text-sm font-medium text-gray-700">Период</label>
        </IftaLabel>
      </div>
      <template #footer>
        <Button label="Отменить" text severity="secondary" @click="isDialog = false" autofocus />
        <Button
          label="Сгенерировать"
          outlined
          severity="success"
          :disabled="!authStore.can('do_update:reports_feature')"
          @click="() => onGeneratedReportSubmit()"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { GeneratedReportPayload } from '@/models/generated_report'
import { useAuthStore } from '@/stores/auth'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

interface ReportProps {
  isCreateAction: boolean
}

const props = defineProps<ReportProps>()

const router = useRouter()
const toast = useToast()
const reportsStore = useReportsStore()
const authStore = useAuthStore()
const reports = ref()
const executeReport = ref<GeneratedReportPayload>({
  report: {
    id: 0,
    name: '',
    description: '',
  },
  date_from: '',
  date_to: '',
})
const isDialog = ref(false)
const isLoading = ref(false)
const selectRow = (data: any) => {
  executeReport.value.report = data
  isDialog.value = true
}

const customUserResolver = (values: GeneratedReportPayload) => {
  const errors: any = {
    report: { invalid: false, error: {} },
    date_from: { invalid: false, error: {} },
    date_to: { invalid: false, error: {} },
  }
  if (!values?.report?.id)
    errors.report = { invalid: true, error: { message: 'Обязательно указать отчёт' } }

  return {
    values,
    errors,
  }
}

const form = computed(() => {
  if (reports.value) {
    const { values, errors } = customUserResolver(executeReport.value)
    return { values, errors }
  }
  return {
    values: {
      report: {
        id: 0,
        name: '',
        description: '',
      },
      date_from: '',
      date_to: '',
    },
    errors: {
      report: { invalid: false, error: { message: '' } },
      date_from: { invalid: false, error: { message: '' } },
      date_to: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const computedDate = computed({
  get() {
    if (!executeReport?.value?.date_from || !executeReport?.value?.date_to)
      return [new Date(), new Date()]
    return [new Date(executeReport?.value?.date_from), new Date(executeReport?.value?.date_to)]
  },
  set(arr: Date[]) {
    let [date_from, date_to] = arr
    if (!date_from) date_from = new Date()
    if (!date_to) date_to = new Date()
    executeReport.value.date_from = date_from?.toISOString()?.split('T')[0]
    executeReport.value.date_to = date_to?.toISOString()?.split('T')[0]
  },
})

const onGeneratedReportSubmit = async () => {
  if (isFormValid.value) {
    isDialog.value = false
    const { values } = form.value
    const default_from = new Date('1970-01-01')
    const default_to = new Date()
    const payload = {
      report_id: values.report.id,
      date_from: values.date_from || default_from.toISOString().split('T')[0],
      date_to: values.date_to || default_to.toISOString().split('T')[0],
    }
    const resp = await reportsStore.execute(payload)
    if (resp) {
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Отчёт успешно сгенерирован',
        life: 3000,
      })
      return
    }
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось сгенерировать отчёт. Попробуйте позже',
      life: 3000,
    })
  }
}

onMounted(async () => {
  isDialog.value = props.isCreateAction
  isLoading.value = true
  await reportsStore.getAllReports()
  reports.value = reportsStore.getReports
  isLoading.value = false
})
onUnmounted(() => {
  reportsStore.clearReports()
})
</script>
