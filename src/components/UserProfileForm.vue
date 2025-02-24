<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import type { User } from '@/models/user'
import { useRolesStore } from '@/stores/roles'
import type { UpdateData } from '@/api/users/update'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'primevue'

interface UserProps {
  usr: User
}

const props = defineProps<UserProps>()
const rolesStore = useRolesStore()
const usersStore = useUsersStore()
const isRolesLoading = ref(false)
const roles = ref()
const toast = useToast()
const isUserLoading = ref(false)

const customUserResolver = (values: User) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    lastname: { invalid: false, error: {} },
    email: { invalid: false, error: {} },
    role: { invalid: false, error: {} },
  }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Имя обязательно' } }
  if (!values?.lastname)
    errors.lastname = { invalid: true, error: { message: 'Фамилия обязательна' } }
  if (!values?.email) errors.email = { invalid: true, error: { messsage: 'Email обязателен' } }
  if (!values?.role?.id) errors.role = { invalid: true, error: { message: 'Роль обязательна' } }
  if (typeof values?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Имя должно быть строкой' } }
  if (typeof values?.lastname !== 'string')
    errors.lastname.push({ message: 'Фамилия должна быть строкой' })
  if (typeof values?.email !== 'string')
    errors.email = { invalid: true, error: { message: 'Email должен быть строкой' } }
  try {
    values.name = values?.name?.trim()
  } catch (err) {
    errors.name = { invalid: true, error: { message: 'Имя не может быть пустым' } }
  }
  try {
    values.lastname = values?.lastname?.trim()
  } catch (err) {
    errors.lastname = { invalid: true, error: { message: 'Фамилия не может быть пустой' } }
  }
  try {
    values.email = values?.email?.trim()?.toLowerCase()
  } catch (err) {
    errors.email = { invalid: true, error: { message: 'Email не может быть пустым' } }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(values?.email || ''))
    errors.email = { invalid: true, error: { message: 'Email не валиден' } }

  return {
    values,
    errors,
  }
}

const form = computed(() => {
  if (user.value) {
    const { values, errors } = customUserResolver(user.value)
    return { values, errors }
  }
  return {
    values: {
      id: 0,
      name: '',
      lastname: '',
      email: '',
      role: {
        id: 0,
        name: '',
        description: '',
        permissions: [],
      },
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      lastname: { invalid: false, error: { message: '' } },
      email: { invalid: false, error: { message: '' } },
      role: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const user = ref<User>({
  id: 0,
  name: '',
  lastname: '',
  email: '',
  role: {
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
  },
})

const onFormSubmit = async () => {
  if (isFormValid.value) {
    const { values } = form.value
    const updateUser: UpdateData = {
      id: values?.id ?? 0,
      email: values?.email ?? '',
      name: values?.name ?? '',
      lastname: values?.lastname ?? '',
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
    }
  }
}

watchEffect(() => {
  user.value = {
    id: props?.usr?.id ?? 0,
    name: props?.usr?.name ?? '',
    lastname: props?.usr?.lastname ?? '',
    email: props?.usr?.email ?? '',
    role: props?.usr?.role ?? {
      id: 0,
      name: '',
      description: '',
      permissions: [],
    },
  }
})

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
      v-model="user"
      :initialValues="props.usr"
      class="grid gap-4 w-full"
      @submit="() => onFormSubmit()"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="user.name"
                fluid
                name="name"
                id="name"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-user"></i>
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
            <label for="name" class="block text-sm font-medium text-gray-700">Имя</label>
          </IftaLabel>
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="user.lastname"
                fluid
                name="lastname"
                id="lastname"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-user"></i>
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
            <label for="lastname" class="block text-sm font-medium text-gray-700">Фамилия</label>
          </IftaLabel>
        </div>
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                id="email"
                v-model="user.email"
                fluid
                name="email"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-at"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.email?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors.email?.error?.message }}
            </Message>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          </IftaLabel>
          <IftaLabel class="w-full">
            <InputGroup>
              <Select
                class="w-full"
                id="role_name"
                v-model="user.role"
                :options="roles"
                checkmark
                optionLabel="name"
                type="text"
              >
                <template #empty>Нет доступных ролей для выбора</template>
                <template #option="slotProps">
                  <div class="flex items-center gap-4">
                    <span class="min-w-20">
                      {{ slotProps.option.name }}
                    </span>
                    <span class="text-gray-400">
                      {{ slotProps.option.description }}
                    </span>
                  </div>
                </template>
              </Select>
              <InputGroupAddon>
                <i class="pi pi-users"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.role?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.role?.error?.message }}
            </Message>
            <label for="role_name" class="block text-sm font-medium text-gray-700">Роль</label>
          </IftaLabel>
        </div>
        <DataTable :value="user?.role?.permissions ?? []" dataKey="id" class="w-full">
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
