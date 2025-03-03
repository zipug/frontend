<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { User } from '@/models/user'
import { useRolesStore } from '@/stores/roles'
import { useUsersStore } from '@/stores/users'
import { Password, useToast } from 'primevue'
import type { RegisterData } from '@/api/users/register'

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
    password: { invalid: false, error: {} },
    repeat_password: { invalid: false, error: {} },
  }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Имя обязательно' } }
  if (!values?.lastname)
    errors.lastname = { invalid: true, error: { message: 'Фамилия обязательна' } }
  if (!values?.email) errors.email = { invalid: true, error: { messsage: 'Email обязателен' } }
  if (!values?.role?.id) errors.role = { invalid: true, error: { message: 'Роль обязательна' } }
  if (!values?.password)
    errors.password = { invalid: true, error: { message: 'Пароль обязателен' } }
  if (!values?.repeat_password)
    errors.repeat_password = { invalid: true, error: { message: 'Пароль обязателен' } }
  if (typeof values?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Имя должно быть строкой' } }
  if (typeof values?.lastname !== 'string')
    errors.lastname.push({ message: 'Фамилия должна быть строкой' })
  if (typeof values?.email !== 'string')
    errors.email = { invalid: true, error: { message: 'Email должен быть строкой' } }
  if (typeof values?.password !== 'string')
    errors.password = { invalid: true, error: { message: 'Пароль должен быть строкой' } }
  if (typeof values?.repeat_password !== 'string')
    errors.repeat_password = { invalid: true, error: { message: 'Пароль должен быть строкой' } }
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
    values.password = values?.password?.trim()
  } catch (err) {
    errors.password = { invalid: true, error: { message: 'Пароль должен быть строкой' } }
  }
  try {
    values.repeat_password = values?.repeat_password?.trim()
  } catch (err) {
    errors.repeat_password = { invalid: true, error: { message: 'Пароль должен быть строкой' } }
  }
  try {
    values.email = values?.email?.trim()?.toLowerCase()
  } catch (err) {
    errors.email = { invalid: true, error: { message: 'Email не может быть пустым' } }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(values?.email || ''))
    errors.email = { invalid: true, error: { message: 'Email не валиден' } }
  if (values?.password && values?.password?.length < 6) {
    errors.password = {
      invalid: true,
      error: { message: 'Пароль должен быть не менее 6 символов' },
    }
  }
  if (values?.password !== values?.repeat_password)
    errors.repeat_password = { invalid: true, error: { message: 'Пароли не совпадают' } }

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
      name: '',
      lastname: '',
      email: '',
      password: '',
      repeat_password: '',
      role: {
        id: 0,
        name: '',
        description: '',
        permissions: [],
        is_custom: false,
      },
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      lastname: { invalid: false, error: { message: '' } },
      email: { invalid: false, error: { message: '' } },
      role: { invalid: false, error: { message: '' } },
      password: { invalid: false, error: { message: '' } },
      repeat_password: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const user = ref<User>({
  name: '',
  lastname: '',
  email: '',
  password: '',
  repeat_password: '',
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
    is_custom: false,
  },
})

const onFormSubmit = async () => {
  if (isFormValid.value) {
    const { values } = form.value
    const registerUser: RegisterData = {
      email: values?.email ?? '',
      name: values?.name ?? '',
      lastname: values?.lastname ?? '',
      password: values?.password ?? '',
      repeat_password: values?.repeat_password ?? '',
    }
    isUserLoading.value = true
    const resp = await usersStore.registerUser(registerUser)
    isUserLoading.value = false
    if (!!resp) {
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Пользователь создан',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось создать пользователя. Попробуйте позже...',
        life: 3000,
      })
    }
  }
}

onMounted(async () => {
  isRolesLoading.value = true
  await rolesStore.getAllRoles()
  roles.value = rolesStore.getRoles
  user.value.role = roles.value.find((el: any) => el.name === 'support')
  isRolesLoading.value = false
})
</script>

<template>
  <div>
    <Form v-model="user" class="grid gap-4 w-full" @submit="() => onFormSubmit()">
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
              <Password
                v-model="user.password"
                feedback
                fluid
                class="w-full"
                id="password"
                name="password"
                toggle-mask
                type="password"
              >
                <template #header>
                  <div class="font-semibold text-xm mb-4">Введите пароль</div>
                </template>
                <template #footer>
                  <div>
                    <Divider />
                    <ul class="pl-2 ml-2 my-0 leading-normal">
                      <li class="mb-1">Длина не менее 10 символов</li>
                      <li class="mb-1">Пароль должен содержать как минимум 1 цифру</li>
                      <li class="mb-1">Пароль должен содержать как минимум 1 специальный символ</li>
                    </ul>
                  </div>
                </template>
              </Password>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.password?.error?.message }}
            </Message>
            <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
          </IftaLabel>
          <IftaLabel class="w-full">
            <InputGroup>
              <Password
                v-model="user.repeat_password"
                feedback
                fluid
                class="w-full"
                id="password"
                name="password"
                toggle-mask
                type="password"
              >
                <template #header>
                  <div class="font-semibold text-xm mb-4">Повторите пароль</div>
                </template>
              </Password>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.repeat_password?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.repeat_password?.error?.message }}
            </Message>
            <label for="password" class="block text-sm font-medium text-gray-700"
              >Повторите пароль</label
            >
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
                disabled
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
        <Button
          :disabled="!isFormValid && isUserLoading"
          class="w-full"
          label="Создать"
          severity="success"
          type="submit"
        />
      </div>
    </Form>
  </div>
</template>
