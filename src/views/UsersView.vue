<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="users"
            :rows="10"
            size="small"
            ref="dt"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #header>
              <span class="flex flex-row justify-between">
                <span class="text-2xl font-medium">Пользователи</span>
                <div class="pb-4 flex flex-row gap-4">
                  <Button
                    rounded
                    size="small"
                    icon="pi pi-plus"
                    label="Создать"
                    @click="router.push('/users/create')"
                    v-if="authStore.can('do_create:users_feature')"
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
            <template #empty> Пользователи не найдены </template>
            <template #loading> Загружаются пользователи. Пожалуйста подождите... </template>
            <Column field="email" header="Email" sortable style="width: 30%"> </Column>
            <Column field="name" header="Имя" sortable style="width: 15%"></Column>
            <Column field="lastname" header="Фамилия" sortable style="width: 15%"></Column>
            <Column field="role.name" header="Роль" sortable style="width: 10%">
              <template #body="{ data }">
                <Tag
                  :value="data.role.name.toUpperCase()"
                  :severity="getRoleSeverity(data.role.name)"
                />
              </template>
            </Column>
            <Column
              field="state"
              header="State"
              :showFilterMenu="false"
              sortable
              style="width: 12.5%"
            >
              <template #body="{ data }">
                <Tag :value="data.state.toUpperCase()" :severity="getSeverity(data.state)" />
              </template>
            </Column>
            <Column class="!text-end" style="width: 5%">
              <template #body="{ data }">
                <ButtonGroup>
                  <Button
                    v-tooltip="'Редактировать пользователя'"
                    icon="pi pi-pencil"
                    :disabled="!authStore.can('do_update:users_feature')"
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
import { useUsersStore } from '@/stores/users'
import { getRoleSeverity } from '@/utils/role_severity'
import { getSeverity } from '@/utils/state_severity'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const users = ref()
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/users/profile/${data.id}`)
}
const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
}

onMounted(async () => {
  isLoading.value = true
  await usersStore.getAllUsers()
  users.value = usersStore.getUsers
  isLoading.value = false
})
onUnmounted(() => {
  usersStore.clearUsers()
})
</script>
