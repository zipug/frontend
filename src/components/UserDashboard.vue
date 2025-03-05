<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useBotsStore } from '@/stores/bots'
import { useChatsStore } from '@/stores/chats'
import { useProjectsStore } from '@/stores/projects'
import { useUsersStore } from '@/stores/users'
import { getBotSeverity, getBotStateIcon } from '@/utils/bot_state_severity'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DoughnutChart from './DoughnutChart.vue'
import UserProjectsChart from './UserProjectsChart.vue'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const botsStore = useBotsStore()
const chatsStore = useChatsStore()
const usersStore = useUsersStore()
const isLoading = ref(false)
const projects = computed(() => projectsStore.getProjects || [])
const bots = computed(() => botsStore.getBots || [])
const chats = computed(() => chatsStore.getChats || [])
const users = computed(() => usersStore.getUsers || [])
const getUser = (user_id: number): string => {
  const user = users.value?.find((user: any) => user.id === user_id)
  return user ? `${user?.name} ${user?.lastname}` : ''
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
const resolved = computed(() => chats.value?.filter((chat: any) => chat?.is_resolved).length)
const not_resolved = computed(() => chats.value?.length - resolved.value)
const tabs = ref('0')
onMounted(async () => {
  isLoading.value = true
  await projectsStore.getAllProjects()
  await botsStore.getAllBots()
  await chatsStore.getAllChats()
  await usersStore.getAllUsers()
  isLoading.value = false
})
onUnmounted(() => {
  projectsStore.clearProjects()
  botsStore.clearBots()
  chatsStore.clearChats()
  usersStore.clearUsers()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="max-md:flex max-md:flex-col grid grid-cols-2 gap-8">
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
    <Panel header="Общая статистика по ботам">
      <Tabs v-model:value="tabs">
        <TabList>
          <Tab value="0">Вопросы пользователей</Tab>
          <Tab value="1" v-if="false">Количество пользователей</Tab>
        </TabList>
        <TabPanels>
          <TabPanel class="flex justify-center items-center" :key="tabs + 1" value="0">
            <DoughnutChart class="max-h-72" :resolved="resolved" :not_resolved="not_resolved" />
          </TabPanel>
          <!--TabPanel :key="tabs + 1" value="1">
            <UserProjectsChart class="min-h-72" :projects="userProjectData" />
          </TabPanel-->
        </TabPanels>
      </Tabs>
    </Panel>
  </div>
</template>
