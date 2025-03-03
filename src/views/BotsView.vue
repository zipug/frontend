<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            size="small"
            :value="bots"
            ref="dt"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            :expandedRows="[]"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #header>
              <span class="flex flex-row justify-between">
                <span class="text-2xl font-medium">Боты</span>
                <div class="pb-4 flex flex-row gap-4">
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-plus"
                    label="Создать"
                    v-if="authStore.can('do_create:bots_feature')"
                    @click="router.push('/bots/create')"
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
            <template #empty>Боты не найдены</template>
            <template #loading>Загружается список ботов. Пожалуйста подождите...</template>
            <template #expansion="{ data }">
              <div class="flex flex-col gap-4">
                <IftaLabel class="w-full">
                  <InputText
                    :model-value="
                      projects?.find((el) => el?.project?.id === data.project_id)?.project?.name
                    "
                    disabled
                    fluid
                  />
                  <label>Проект</label>
                </IftaLabel>
                <IftaLabel class="w-full">
                  <Password
                    v-model="data.api_token"
                    :toggle-mask="authStore.can('do_update:bots_feature')"
                    disabled
                    fluid
                  />
                  <label>Telegram Bot Token</label>
                </IftaLabel>
              </div>
            </template>
            <Column expander style="width: 1rem" />
            <Column field="name" header="Название" sortable style="width: 30%"> </Column>
            <Column
              field="description"
              header="Описание"
              class="max-w-16 truncate"
              style="width: 40%"
            >
            </Column>
            <Column field="state" header="Статус" style="width: 20%">
              <template #body="{ data }">
                <Tag
                  :value="data.state.toUpperCase()"
                  :icon="getBotStateIcon(data.state)"
                  :severity="getBotSeverity(data.state)"
                />
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Настроить бота'"
                    icon="pi pi-cog"
                    :disabled="!authStore.can('do_update:bots_feature')"
                    @click="updateBot(data)"
                    severity="secondary"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Запустить бота'"
                    icon="pi pi-play"
                    :disabled="!authStore.can('do_update:bots_feature') || data.state === 'running'"
                    @click="runBot(data)"
                    severity="success"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Остановить бота'"
                    icon="pi pi-pause"
                    :disabled="!authStore.can('do_update:bots_feature') || data.state === 'stopped'"
                    @click="stopBot(data)"
                    severity="warn"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Удалить бота'"
                    icon="pi pi-trash"
                    :disabled="!authStore.can('do_delete:bots_feature')"
                    @click="deleteBot(data)"
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
import { useAuthStore } from '@/stores/auth'
import { useBotsStore } from '@/stores/bots'
import { useProjectsStore } from '@/stores/projects'
import { getBotSeverity, getBotStateIcon } from '@/utils/bot_state_severity'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const botsStore = useBotsStore()
const projectsStore = useProjectsStore()
const bots = computed(() => botsStore.getBots)
const projects = computed(() => projectsStore.getProjects || [])
const isLoading = ref(false)
const updateBot = (data: any) => {
  router.push(`/bots/${data.id}`)
}
const runBot = async (data: any) => {
  const resp = await botsStore.runBotById(data.id)
  if (resp) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Бот успешно запущен',
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось запустить бота',
    life: 3000,
  })
}
const stopBot = async (data: any) => {
  const resp = await botsStore.stopBotById(data.id)
  if (resp) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Бот успешно остановлен',
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось остановить бота',
    life: 3000,
  })
}
const deleteBot = async (data: any) => {
  const resp = await botsStore.deleteBotById(data.id)
  if (resp) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Бот успешно удалён',
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось удалить бота',
    life: 3000,
  })
}
const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

onMounted(async () => {
  isLoading.value = true
  await projectsStore.getAllProjects()
  await botsStore.getAllBots()
  isLoading.value = false
})
onUnmounted(() => {
  botsStore.clearBots()
})
</script>
