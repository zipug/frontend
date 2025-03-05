<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useBotsStore } from '@/stores/bots'
import { useChatsStore } from '@/stores/chats'
import { useProjectsStore } from '@/stores/projects'
import { useUsersStore } from '@/stores/users'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const chatsStore = useChatsStore()
const projectsStore = useProjectsStore()
const botsStore = useBotsStore()
const usersStore = useUsersStore()
const isLoading = ref(false)
const projects = computed(() => projectsStore.getProjects)
const bots = computed(() => botsStore.getBots)
const users = computed(() => usersStore.getUsers)
const chats = computed(() => chatsStore.getChats)
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
onMounted(async () => {
  isLoading.value = true
  await projectsStore.getAllProjects()
  await botsStore.getAllBots()
  await usersStore.getAllUsers()
  await chatsStore.getAllChats()
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
          <Column field="project_name" header="Проект" style="width: 40%">
            <template #body="{ data }">
              <Tag icon="pi pi-server" :value="data.project_name" />
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>
    <div>
      <Panel header="Чаты">
        <DataTable
          size="small"
          :value="chats"
          :rows="3"
          :rowsPerPageOptions="[3, 5, 10]"
          scrollable
          paginator
          :loading="isLoading"
        >
          <Column field="question" header="Впорос" sortable style="width: 50%"> </Column>
          <Column field="name" header="Проект" sortable style="width: 30%">
            <template #body="{ data }">
              <Tag
                icon="pi pi-server"
                :value="data.name.length > 20 ? data.name.slice(0, 20) + '...' : data.name"
              />
            </template>
          </Column>
          <Column field="is_resolved" header="Статус" style="width: 30%">
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
                  @click="router.push(`/chats/${data.id}`)"
                  severity="secondary"
                  variant="text"
                />
              </ButtonGroup>
            </template>
          </Column>
        </DataTable>
      </Panel>
    </div>
  </div>
</template>
