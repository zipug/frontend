<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title><span class="text-2xl">Роли</span></template>
      <template #content>
        <div class="space-y-4">
          <DataTable
            paginator
            :value="roles"
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            dataKey="id"
            tableStyle="min-width: 50 rem"
            :loading="isLoading"
          >
            <template #empty> Роли не найдены </template>
            <template #loading> Загружаются роли. Пожалуйста подождите... </template>
            <Column field="name" header="Название роли" sortable style="width: 35%"> </Column>
            <Column field="description" header="Описание роли" sortable style="width: 45%"></Column>
            <Column field="is_custom" header="Тип" sortable style="width: 10%">
              <template #body="{ data }">
                <Tag
                  :value="data.is_custom ? 'Пользовательский' : 'Системный'"
                  :severity="data.is_custom ? 'info' : 'success'"
                  icon="pi pi-users"
                />
              </template>
            </Column>
            <Column class="!text-end" style="width: 10%">
              <template #body="{ data }">
                <Button
                  v-tooltip="'Редактировать роль'"
                  icon="pi pi-pencil"
                  :disabled="!data.is_custom"
                  @click="selectRow(data)"
                  severity="secondary"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
      <template #footer>
        <Button
          v-tooltip="'Создать новую роль'"
          icon="pi pi-plus"
          @click="router.push('/roles/create')"
          class="!float-right"
          label="Создать"
          severity="success"
        ></Button>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'
import { useToast } from 'primevue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const rolesStore = useRolesStore()
const roles = ref()
const isLoading = ref(false)
const selectRow = (data: any) => {
  router.push(`/roles/${data.id}`)
}

onMounted(async () => {
  isLoading.value = true
  await rolesStore.getAllRoles()
  roles.value = rolesStore.getRoles
  isLoading.value = false
})
onUnmounted(() => {
  rolesStore.clearRoles()
})
</script>
