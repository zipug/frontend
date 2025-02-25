<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Статьи</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="articles"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty> Статьи не найдены </template>
            <template #loading> Загружаются статьи. Пожалуйста подождите... </template>
            <Column
              field="name"
              header="Название"
              class="max-w-16 truncate"
              sortable
              style="width: 20%"
            >
            </Column>
            <Column
              field="description"
              header="Описание"
              class="max-w-20 truncate"
              style="width: 25%"
            >
              <template #body="{ data }">
                <span v-if="!data.description?.startsWith('generated_by')">{{
                  data.description
                }}</span>
                <span v-else>Отсутствует</span>
              </template>
            </Column>
            <Column header="Тип" sortable style="width: 20%">
              <template #body="{ data }">
                <Tag
                  v-if="data.description?.startsWith('generated_by')"
                  :value="data.description.split(':')[1]"
                  icon="pi pi-android"
                  severity="info"
                />
                <Tag v-else value="пользователь" icon="pi pi-user" severity="primary" />
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <Button
                  v-tooltip="'Редактировать Статью'"
                  icon="pi pi-pencil"
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
import { useArticlesStore } from '@/stores/articles'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const articlesStore = useArticlesStore()
const articles = ref()
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/articles/profile/${data.id}`)
}

onMounted(async () => {
  isLoading.value = true
  await articlesStore.getAllArticles()
  articles.value = articlesStore.getArticles
  isLoading.value = false
})
onUnmounted(() => {
  articlesStore.clearArticles()
})
</script>
