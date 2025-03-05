<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="articles"
            :rows="10"
            ref="dt"
            size="small"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #header>
              <span
                class="flex max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:gap-2 flex-row justify-between"
              >
                <span class="text-2xl max-sm:text-xl font-medium">Статьи</span>
                <div class="pb-4 flex flex-row gap-4">
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-plus"
                    label="Создать"
                    v-if="authStore.can('do_create:articles_feature')"
                    @click="router.push('/articles/create')"
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
            <template #empty> Статьи не найдены </template>
            <template #loading> Загружаются статьи. Пожалуйста подождите... </template>
            <Column field="name" header="Название" sortable style="width: 45%"> </Column>
            <Column
              field="description"
              header="Описание"
              class="max-w-20 truncate"
              style="width: 45%"
            >
              <template #body="{ data }">
                <span>{{ data?.description }}</span>
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Редактировать статью'"
                    icon="pi pi-pencil"
                    @click="selectRow(data)"
                    :disabled="!authStore.can('do_update:articles_feature')"
                    severity="secondary"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Удалить статью'"
                    icon="pi pi-trash"
                    @click="deleteArticle(data)"
                    :disabled="!authStore.can('do_delete:articles_feature')"
                    severity="danger"
                    variant="text"
                  />
                </ButtonGroup>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const articles = computed(() => articlesStore.getArticles)
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/articles/${data.id}`)
}
const deleteArticle = async (data: any) => {
  const success = await articlesStore.deleteArticle(data.id)
  if (success) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Статья удалена',
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить статью',
      life: 3000,
    })
  }
}
const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

onMounted(async () => {
  isLoading.value = true
  await articlesStore.getAllArticles()
  isLoading.value = false
})
onUnmounted(() => {
  articlesStore.clearArticles()
})
</script>
