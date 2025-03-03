<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="attachments"
            :rows="10"
            :expandedRows="[]"
            ref="dt"
            size="small"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #header>
              <span class="flex flex-row justify-between">
                <span class="text-2xl font-medium">Вложения (файлы)</span>
                <div class="pb-4 flex flex-row gap-4">
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-upload"
                    label="Загрузить"
                    @click="() => (isUploadDialog = true)"
                  />
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-file-excel"
                    label="Экспорт"
                    @click="() => exportCSV()"
                  />
                </div>
              </span>
            </template>
            <template #empty> Вложения не найдены </template>
            <template #loading> Вложения загружаются. Пожалуйста подождите... </template>
            <template #expansion="{ data }">
              <h2 class="text-lg font-bold">Статьи</h2>
              <DataTable
                :value="
                  articles?.filter((el) => el?.attachments?.some((el) => el?.id === data.id)) ?? []
                "
                dataKey="id"
                class="w-full"
              >
                <template #empty> Файл не привязан ни к одной статье </template>
                <template #loading> Загружаются статьи. Пожалуйста подождите... </template>
                <Column field="name" header="Название" sortable style="width: 40%"></Column>
                <Column field="description" header="Описание" sortable style="width: 40%"></Column>
              </DataTable>
            </template>
            <Column expander style="width: 1rem" />
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
            <Column class="!text-end" style="width: 5%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Скачать файл'"
                    icon="pi pi-download"
                    @click="downloadFile(data)"
                    :disabled="!authStore.can('do_update:attachments_feature')"
                    severity="secondary"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Привязать к статье'"
                    icon="pi pi-paperclip"
                    @click="setAttachmentForBind(data)"
                    :disabled="!authStore.can('do_update:attachments_feature')"
                    severity="secondary"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Удалить файл'"
                    icon="pi pi-trash"
                    :disabled="!authStore.can('do_delete:attachments_feature')"
                    @click="deleteFile(data)"
                    severity="danger"
                    variant="text"
                  />
                </ButtonGroup>
              </template>
            </Column>
          </DataTable>
          <Dialog v-model:visible="isUploadDialog" modal header="Загрузить файл">
            <FileUpload
              :customUpload="true"
              @uploader="onAdvancedUpload($event)"
              :multiple="true"
              :maxFileSize="1000000"
            >
              <template #empty>
                <span>Перетяните файлы сюда для загрузки.</span>
              </template>
            </FileUpload>
          </Dialog>
          <Dialog
            v-model:visible="isBindDialog"
            modal
            header="Привязать к статье"
            :style="{ width: '48rem' }"
          >
            <IftaLabel class="w-full">
              <InputGroup>
                <Select
                  class="w-full"
                  id="article_id"
                  v-model="article"
                  :options="articles"
                  checkmark
                  type="text"
                  optionLabel="name"
                >
                  <template #empty>Нет доступных статей для выбора</template>
                  <template #option="slotProps">
                    <div class="flex items-center gap-4">
                      <span class="max-w-96">
                        {{ slotProps.option?.name || '' }}
                      </span>
                    </div>
                  </template>
                </Select>
                <InputGroupAddon>
                  <i class="pi pi-pencil"></i>
                </InputGroupAddon>
              </InputGroup>
              <Message v-if="!article" severity="error" size="small" variant="simple">
                Выберите статью
              </Message>
              <label for="article_id" class="block text-sm font-medium text-gray-700">Статья</label>
            </IftaLabel>
            <template #footer>
              <Button
                label="Отментить"
                text
                severity="primary"
                @click="isBindDialog = false"
                autofocus
              />
              <Button label="Прикрепить" outlined severity="primary" @click="bindFile" autofocus />
            </template>
          </Dialog>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/api/client'
import { ATTACHMENTS_PATH, BASE_URL } from '@/constants/api'
import type { Attachment } from '@/models/attachment'
import { useArticlesStore } from '@/stores/articles'
import { useAttachmentsStore } from '@/stores/attachments'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}
const isUploadDialog = ref(false)
const isBindDialog = ref(false)
const toast = useToast()
const attachmentsStore = useAttachmentsStore()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const article = ref()
const articles = computed(() => articlesStore.getArticles || [])
const attachments = computed(() => attachmentsStore.getAttachments)
const attahcmentForBind = ref()
const isLoading = ref(false)
const shortLink = (link: string): string => {
  return link?.split('attachments/')[1]?.split('?')[0]
}

const setAttachmentForBind = (data: any) => {
  attahcmentForBind.value = data
  isBindDialog.value = true
}
interface uploadData {
  data: Attachment[]
  errors: string[] | null
  status: 'success' | 'failed'
}

const onAdvancedUpload = async (event: any) => {
  const { files } = event
  const url = `${BASE_URL}${ATTACHMENTS_PATH}upload`

  const formData = new FormData()
  files.forEach((file: any) => {
    formData.append('file', file)
  })

  const response = await api().postForm<uploadData>(url, formData)
  if (response.data.status === 'success') {
    await attachmentsStore.getAllAttachments()
    toast.add({
      severity: 'info',
      summary: 'Успешно',
      detail: 'Файлы (файл) загружены',
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить файл (файлы). Попробуйте позже',
      life: 5000,
    })
  }
}

const deleteFile = async (data: any) => {
  const resp = await attachmentsStore.deleteAttachmentById(data.id)
  if (resp) {
    await attachmentsStore.getAllAttachments()
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Файл ${data.name} удален`,
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось удалить файл. Попробуйте позже',
    life: 3000,
  })
}

const bindFile = async () => {
  const resp = await attachmentsStore.bindAttachmentById(
    article.value.id,
    attahcmentForBind.value.id,
  )
  if (resp) {
    await attachmentsStore.getAllAttachments()
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: `Файл ${attahcmentForBind.value.name} прикреплён к статье`,
      life: 3000,
    })
    isBindDialog.value = false
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось прикрепить файл. Попробуйте позже',
    life: 3000,
  })
  isBindDialog.value = false
}

const downloadFile = async (data: any) => {
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
  await articlesStore.getAllArticles()
  isLoading.value = false
})
onUnmounted(() => {
  attachmentsStore.clearAttachments()
})
</script>
