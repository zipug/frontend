<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Вложения (файлы)</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="attachments"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty> Вложения не найдены </template>
            <template #loading> Вложения загружаются. Пожалуйста подождите... </template>
            <Column field="name" header="Название" sortable style="width: 30%"> </Column>
            <Column field="url" header="Ссылка" sortable style="width: 40%">
              <template #body="{ data }">
                <a :href="data.url" target="_blank" v-tooltip="'Посмотреть файл'">
                  <Tag :value="shortLink(data?.url)" icon="pi pi-link" severity="primary" />
                </a>
              </template>
            </Column>
            <Column field="mimetype" header="Тип файла" sortable style="width: 20%">
              <template #body="{ data }">
                <Chip :label="data?.mimetype?.split('/')[1]" icon="pi pi-file-excel" />
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <Button
                  v-tooltip="'Скачать файл'"
                  icon="pi pi-download"
                  @click="selectRow(data)"
                  severity="secondary"
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
import { useAttachmentsStore } from '@/stores/attachments'
import { useToast } from 'primevue'
import { onMounted, onUnmounted, ref } from 'vue'

const toast = useToast()
const attachmentsStore = useAttachmentsStore()
const attachments = ref()
const isLoading = ref(false)
const shortLink = (link: string): string => {
  return link?.split('attachments/')[1]?.split('?')[0]
}
const selectRow = async (data: any) => {
  toast.add({
    severity: 'info',
    summary: 'Скачать файл',
    detail: `Файл ${data.name} будет скачан на ваш компьютер в ближайшее время`,
    life: 3000,
  })
  const resp = await fetch(data.url)
  const resp_text = await resp.blob()
  if (resp !== null) {
    const blob = new Blob([resp_text], { type: `${data.mimetype};charset=utf-8;` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = data.name
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
      detail: `Файл ${data.name} скачан`,
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось скачать файл. Попробуйте позже',
    life: 5000,
  })
}

onMounted(async () => {
  isLoading.value = true
  await attachmentsStore.getAllAttachments()
  attachments.value = attachmentsStore.getAttachments
  isLoading.value = false
})
onUnmounted(() => {
  attachmentsStore.clearAttachments()
})
</script>
