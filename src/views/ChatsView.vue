<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            scrollable
            :value="chats"
            :rows="10"
            ref="dt"
            size="small"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #header>
              <span class="flex flex-row justify-between">
                <span class="text-2xl font-medium">Чаты</span>
                <div class="pb-4 flex flex-row gap-4">
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
            <template #empty>Чаты не найдены</template>
            <template #loading>Загружается список чатов. Пожалуйста подождите...</template>
            <Column field="question" header="Вопрос" class="max-w-16 truncate" style="width: 30%">
            </Column>
            <Column field="name" header="Проект" sortable style="width: 20%">
              <template #body="{ data }">
                <Chip
                  icon="pi pi-server"
                  :label="data.name.length > 20 ? data.name.slice(0, 20) + '...' : data.name"
                />
              </template>
            </Column>
            <Column
              field="created_at"
              header="Время"
              sortable
              class="max-w-16 truncate"
              style="width: 20%"
            >
              <template #body="{ data }"
                ><Tag
                  :value="
                    new Date(data.created_at)?.toISOString()?.split('T').join(' ')?.slice(0, -5)
                  "
                  severity="secondary"
                />
              </template>
            </Column>
            <Column field="is_resolved" header="Статус" sortable style="width: 10%">
              <template #body="{ data }">
                <Tag
                  :value="data.is_resolved ? 'РЕШЕН' : 'НЕ РЕШЕН'"
                  :severity="data.is_resolved ? 'success' : 'danger'"
                />
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Открыть чат'"
                    icon="pi pi-angle-right"
                    :disabled="!authStore.can('do_update:chats_feature')"
                    @click="selectRow(data)"
                    severity="secondary"
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
import { useAuthStore } from '@/stores/auth'
import { useChatsStore } from '@/stores/chats'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const chatsStore = useChatsStore()
const chats = computed(() => {
  if (authStore.can('do_create:chats_feature')) {
    return chatsStore.getChats
      ?.filter((el) => el?.user_id === authStore.getUserData?.id)
      ?.sort((b, a) => {
        if (a.id < b.id) return -1
        else if (b.id < a.id) return 1
        else return 0
      })
  } else if (authStore.can('do_read:chats_feature')) {
    return chatsStore.getChats
      ?.filter((el) => el?.created_by === authStore.getUserData?.id)
      ?.reduce((acc: any, val) => {
        if (acc.findIndex((el: any) => el?.id === val?.id) === -1) {
          return [...acc, val]
        }
        return acc
      }, [])
      ?.sort((b: any, a: any) => {
        if (a.id < b.id) return -1
        else if (b.id < a.id) return 1
        else return 0
      })
  }
})
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/chats/${data.id}`)
}

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

onMounted(async () => {
  isLoading.value = true
  await chatsStore.getAllChats()
  isLoading.value = false
})
onUnmounted(() => {
  chatsStore.clearChats()
})
</script>
