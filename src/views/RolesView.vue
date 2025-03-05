<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #content>
        <div class="space-y-4">
          <DataTable
            :value="roles"
            dataKey="id"
            ref="dt"
            size="small"
            tableStyle="min-width: 50 rem"
            :expandedRows="[]"
            :loading="isLoading"
          >
            <template #header>
              <span
                class="flex max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:gap-2 flex-row justify-between"
              >
                <span class="text-2xl font-medium max-sm:text-xl">Роли</span>
                <div class="pb-4">
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
            <template #empty> Роли не найдены </template>
            <template #loading> Загружаются роли. Пожалуйста подождите... </template>
            <Column expander style="width: 1rem" />
            <Column field="name" header="Название роли" sortable style="width: 50%"> </Column>
            <Column field="description" header="Описание роли" sortable style="width: 50%"></Column>
            <template #expansion="{ data }">
              <h2 class="text-lg font-bold">Права</h2>
              <DataTable :value="data?.permissions ?? []" dataKey="id" class="w-full">
                <template #empty> У пользователя нет прав </template>
                <template #loading> Загружаются пользователи. Пожалуйста подождите... </template>
                <Column field="description" header="Описание" sortable style="width: 40%"></Column>
                <Column
                  field="do_read"
                  dataType="boolean"
                  header="Чтение"
                  bodyClass="text-center"
                  style="width: 15%"
                >
                  <template #body="{ data }">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500 ': data.do_read,
                        'pi-times-circle text-red-500': !data.do_read,
                      }"
                    ></i>
                  </template>
                </Column>
                <Column
                  field="do_update"
                  dataType="boolean"
                  header="Измененение"
                  bodyClass="text-center"
                  style="width: 15%"
                >
                  <template #body="{ data }">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500 ': data.do_update,
                        'pi-times-circle text-red-500': !data.do_update,
                      }"
                    ></i>
                  </template>
                </Column>
                <Column
                  field="do_create"
                  dataType="boolean"
                  header="Создание"
                  bodyClass="text-center"
                  style="width: 15%"
                >
                  <template #body="{ data }">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500 ': data.do_create,
                        'pi-times-circle text-red-500': !data.do_create,
                      }"
                    ></i>
                  </template>
                </Column>
                <Column
                  field="do_delete"
                  dataType="boolean"
                  header="Удаление"
                  bodyClass="text-center"
                  style="width: 15%"
                >
                  <template #body="{ data }">
                    <i
                      class="pi"
                      :class="{
                        'pi-check-circle text-green-500 ': data.do_delete,
                        'pi-times-circle text-red-500': !data.do_delete,
                      }"
                    ></i>
                  </template>
                </Column>
              </DataTable>
            </template>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'
import { onMounted, onUnmounted, ref } from 'vue'

const rolesStore = useRolesStore()
const roles = ref()
const isLoading = ref(false)
const dt = ref()
const exportCSV = () => {
  dt.value.exportCSV()
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
