<script lang="ts" setup>
import { useBotsStore } from '@/stores/bots'
import { useProjectsStore } from '@/stores/projects'
import { useResourcesStore } from '@/stores/resources'
import { useUsersStore } from '@/stores/users'
import { getBotSeverity, getBotStateIcon } from '@/utils/bot_state_severity'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CpuChart from './CpuChart.vue'

const resourcesStore = useResourcesStore()
const projectsStore = useProjectsStore()
const botsStore = useBotsStore()
const usersStore = useUsersStore()
const resources = computed(() => resourcesStore.getResources)
const ramMeter = computed(() => [
  {
    label: 'RAM used',
    value: resources?.value?.[resources?.value?.length - 1]?.ram?.usage || 0,
    color: 'var(--p-red-500)',
  },
])
const hddMeter = computed(() => [
  {
    label: 'HDD used',
    value: resources?.value?.[resources?.value?.length - 1]?.hdd?.usage || 0,
    color: 'var(--p-blue-500)',
  },
])
const totalRam = computed(
  () => (resources?.value?.[resources?.value?.length - 1]?.ram?.total || 0) / (1 << 30),
)
const totalHdd = computed(
  () => (resources?.value?.[resources?.value?.length - 1]?.hdd?.total || 0) / (1 << 30),
)
const isLoading = ref(false)
const projects = computed(() => projectsStore.getProjects)
const bots = computed(() => botsStore.getBots)
const users = computed(() => usersStore.getUsers)
const getUser = (user_id: number): string => {
  const user = users.value?.find((user: any) => user.id === user_id)
  return user ? `${user?.name} ${user?.lastname}` : ''
}
const getUserAvatar = (user_id: number): string => {
  return getUser(user_id)
    ?.split(' ')
    ?.map((el: string) => el?.[0]?.toUpperCase())
    ?.join('')
}
const botProjects = computed(() => {
  return bots.value?.map((bot: any) => {
    return {
      ...bot,
      project_name: projects?.value?.find((el: any) => +el?.project?.id === +bot.project_id)
        ?.project?.name,
    }
  })
})
onMounted(async () => {
  isLoading.value = true
  await projectsStore.getAllProjects()
  await botsStore.getAllBots()
  await usersStore.getAllUsers()
  isLoading.value = false
})
onUnmounted(() => {
  projectsStore.clearProjects()
  botsStore.clearBots()
  usersStore.clearUsers()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="grid grid-cols-2 gap-8">
      <Panel header="Проекты">
        <DataTable
          :value="projects"
          size="small"
          :rows="3"
          paginator
          scrollable
          :rowsPerPageOptions="[3, 5, 10]"
          :loading="isLoading"
        >
          <template #empty>Проекты не найдены</template>
          <template #loading>Загружается список проектов. Пожалуйста подождите...</template>
          <Column
            field="project.name"
            header="Название"
            class="max-w-12 truncate"
            sortable
            style="width: 30%"
          ></Column>
          <Column field="project.remote_url" header="Ссылка" style="width: 30%">
            <template #body="{ data }">
              <Tag
                :value="data.project.remote_url"
                icon="pi pi-link"
                severity="info"
                class="hover:underline"
              />
            </template>
          </Column>
          <Column field="project.user_id" header="Пользователь" style="width: 40%">
            <template #body="{ data }">
              <Tag icon="pi pi-user" :value="getUser(data.project.user_id)" />
            </template>
          </Column>
        </DataTable>
      </Panel>
      <Panel header="Боты">
        <DataTable
          size="small"
          :value="botProjects"
          :rows="3"
          :rowsPerPageOptions="[3, 5, 10]"
          scrollable
          paginator
          :loading="isLoading"
        >
          <Column field="name" header="Название" sortable style="width: 30%"> </Column>
          <Column field="state" header="Статус" style="width: 30%">
            <template #body="{ data }">
              <Tag
                :value="data.state.toUpperCase()"
                :icon="getBotStateIcon(data.state)"
                :severity="getBotSeverity(data.state)"
              />
            </template>
          </Column>
          <Column field="project_name" header="Проект" style="width: 40%">
            <template #body="{ data }">
              <Tag icon="pi pi-server" :value="data.project_name" />
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>
    <Panel header="Потребление ресурсов">
      <Tabs value="0">
        <TabList>
          <Tab value="0">CPU</Tab>
          <Tab value="1">HDD & RAM</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <Panel>
              <CpuChart :cpu="resources?.map((r: any) => r?.cpu?.usage) || []" class="max-h-72" />
            </Panel>
          </TabPanel>
          <TabPanel value="1">
            <MeterGroup :value="ramMeter">
              <template #start="{ totalPercent }">
                <div class="flex justify-between mt-4 mb-2 relative">
                  <span>RAM</span>
                  <span class="font-medium">{{ totalRam.toFixed(2) }} GB</span>
                </div>
              </template>
            </MeterGroup>
            <MeterGroup :value="hddMeter">
              <template #start="{ totalPercent }">
                <div class="flex justify-between mt-4 mb-2 relative">
                  <span>HDD</span>
                  <span class="font-medium">{{ totalHdd.toFixed(2) }} GB</span>
                </div>
              </template>
            </MeterGroup>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Panel>
  </div>
</template>
