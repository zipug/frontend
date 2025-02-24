<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Пользователи</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="users"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty> Пользователи не найдены </template>
            <template #loading> Загружаются пользователи. Пожалуйста подождите... </template>
            <Column field="email" header="Email" sortable style="width: 35%"> </Column>
            <Column field="name" header="Имя" sortable style="width: 20%"></Column>
            <Column field="lastname" header="Фамилия" sortable style="width: 20%"></Column>
            <Column
              field="state"
              header="State"
              :showFilterMenu="false"
              sortable
              style="width: 12.5%"
            >
              <template #body="{ data }">
                <Tag :value="data.state" :severity="getSeverity(data.state)" />
              </template>
            </Column>
            <Column class="!text-end" style="width: 12.5%">
              <template #body="{ data }">
                <Button
                  v-tooltip="'Редактировать пользователя'"
                  icon="pi pi-pencil"
                  @click="selectRow(data)"
                  severity="secondary"
                  rounded
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
import { useUsersStore } from '@/stores/users'
import { getSeverity } from '@/utils/state_severity'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usersStore = useUsersStore()
const users = ref()
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/users/profile/${data.id}`)
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
