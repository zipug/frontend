<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRolesStore } from '@/stores/roles'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'primevue'
import type { Role } from '@/models/role'

const rolesStore = useRolesStore()
const isRolesLoading = ref(false)
const roles = ref()
const toast = useToast()
const isUserLoading = ref(false)

const customUserResolver = (values: Role) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    lastname: { invalid: false, error: {} },
    email: { invalid: false, error: {} },
    role: { invalid: false, error: {} },
  }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Название обязательно' } }
  if (typeof values?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Название должно быть строкой' } }
  if (typeof values?.description !== 'string')
    errors.email = { invalid: true, error: { message: 'Название должно быть строкой' } }
  try {
    values.name = values?.name?.trim()
  } catch (err) {
    errors.name = { invalid: true, error: { message: 'Название не может быть пустым' } }
  }
  try {
    values.description = values?.description?.trim()
  } catch (err) {
    errors.lastname = { invalid: true, error: { message: 'Описание не может быть пустым' } }
  }

  return {
    values,
    errors,
  }
}

const form = computed(() => {
  if (role.value) {
    const { values, errors } = customUserResolver(role.value)
    return { values, errors }
  }
  return {
    values: {
      id: 0,
      name: '',
      description: '',
      permissions: [],
      is_custom: false,
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      description: { invalid: false, error: { message: '' } },
      permissions: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const role = ref<Role>({
  id: 0,
  name: '',
  description: '',
  permissions: [
    {
      name: '',
      description: '',
      do_read: false,
      do_update: false,
      do_create: false,
      do_delete: false,
    },
  ],
  is_custom: false,
})

const onFormSubmit = async () => {
  if (isFormValid.value) {
    const { values } = form.value
    console.log(values)
    /*const updateUser: UpdateData = {
      id: values?.id ?? 0,
      name: values?.name ?? '',
      lastname: values?.description ?? '',
    }
    isUserLoading.value = true
    const resp = await usersStore.updateUserById(updateUser)
    isUserLoading.value = false
    if (!!resp) {
      user.value = {
        id: resp?.id ?? 0,
        state: resp?.state ?? '',
        name: resp?.name ?? '',
        lastname: resp?.lastname ?? '',
        email: resp?.email ?? '',
        ...user.value,
      }
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Профиль обновлен',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Профиль не обновлен',
        life: 3000,
      })
    }*/
  }
}

onMounted(async () => {
  isRolesLoading.value = true
  await rolesStore.getAllRoles()
  roles.value = rolesStore.getRoles
  isRolesLoading.value = false
})
</script>

<template>
  <div>
    <Form
      v-model="role"
      :initialValues="role"
      class="grid gap-4 w-full"
      @submit="() => onFormSubmit()"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="role.name"
                fluid
                name="name"
                id="name"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-id-card"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.name?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.name?.error?.message }}
            </Message>
            <label for="name" class="block text-sm font-medium text-gray-700">Название</label>
          </IftaLabel>
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="role.description"
                fluid
                name="lastname"
                id="lastname"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-info-circle"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.lastname?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.lastname?.error?.message }}
            </Message>
            <label for="lastname" class="block text-sm font-medium text-gray-700">Описание</label>
          </IftaLabel>
        </div>
        <DataTable :value="role?.permissions ?? []" dataKey="id" class="w-full">
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
        <Button
          :disabled="!isFormValid && isUserLoading"
          class="w-full"
          label="Обновить"
          severity="success"
          type="submit"
        />
      </div>
    </Form>
  </div>
</template>
