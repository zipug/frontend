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
            :value="projects"
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
                <span class="text-2xl font-medium">Проекты</span>
                <div class="pb-4 flex flex-row gap-4">
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-plus"
                    label="Создать"
                    v-if="authStore.can('do_create:projects_feature')"
                    @click="router.push('/projects/create')"
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
            <template #empty>Проекты не найдены</template>
            <template #loading>Загружается список проектов. Пожалуйста подождите...</template>
            <Column field="project.name" header="Название" sortable style="width: 20%"> </Column>
            <Column
              field="project.description"
              header="Описание"
              class="max-w-16 truncate"
              style="width: 20%"
            >
            </Column>
            <Column field="project.remote_url" header="Ссылка" style="width: 20%">
              <template #body="{ data }">
                <Tag
                  :value="data.project.remote_url"
                  icon="pi pi-link"
                  severity="info"
                  class="hover:underline"
                />
              </template>
            </Column>
            <Column field="project.user_id" header="Пользователь" style="width: 20%">
              <template #body="{ data }">
                <span>
                  <Avatar :label="getUserAvatar(data.project.user_id)" shape="circle" />
                  <span class="text-sm ml-2">{{ getUser(data.project.user_id) }}</span>
                </span>
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Изменить проект'"
                    icon="pi pi-wrench"
                    :disabled="!authStore.can('do_update:projects_feature')"
                    @click="updateProject(data)"
                    severity="secondary"
                    variant="text"
                  />
                  <Button
                    v-tooltip="'Удалить проект'"
                    icon="pi pi-trash"
                    :disabled="!authStore.can('do_update:projects_feature')"
                    @click="deleteProject(data)"
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
import { useProjectsStore } from '@/stores/projects'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'primevue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const projectsStore = useProjectsStore()
const users = computed(() => usersStore.getUsers || [])
const projects = computed(() => projectsStore.getProjects)
const isLoading = ref(false)
const updateProject = (data: any) => {
  router.push(`/projects/${data.project.id}`)
}
const deleteProject = async (data: any) => {
  const resp = await projectsStore.deleteProjectById(+data.project.id)
  if (resp) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Проект успешно удалён',
      life: 3000,
    })
    return
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: 'Не удалось удалить проект',
    life: 3000,
  })
}

const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

const getUser = (user_id: number): string => {
  const user = users.value.find((user: any) => user?.id === user_id)
  return user ? `${user.name} ${user.lastname}` : ''
}
const getUserAvatar = (user_id: number): string => {
  return getUser(user_id)
    ?.split(' ')
    ?.map((el: string) => el?.[0]?.toUpperCase())
    ?.join('')
}

onMounted(async () => {
  isLoading.value = true
  await projectsStore.getAllProjects()
  await usersStore.getAllUsers()
  isLoading.value = false
})
onUnmounted(() => {
  usersStore.clearUsers()
  projectsStore.clearProjects()
})
</script>
