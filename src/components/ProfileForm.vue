<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/models/user'
import { useUsersStore } from '@/stores/users'
import type { UpdateData } from '@/api/users/update'
import { useToast } from 'primevue'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const toast = useToast()

const customUserResolver = (values: User) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    lastname: { invalid: false, error: {} },
    email: { invalid: false, error: {} },
  }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Имя обязательно' } }
  if (!values?.lastname)
    errors.lastname = { invalid: true, error: { message: 'Фамилия обязательна' } }
  if (!values?.email) errors.email = { invalid: true, error: { messsage: 'Email обязателен' } }
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

const user = ref<User>({
  name: '',
  lastname: '',
  email: '',
})

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
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      lastname: { invalid: false, error: { message: '' } },
      email: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

onMounted(() => {
  const data = authStore.getUserData
  if (!!data)
    user.value = {
      id: data?.id ?? 0,
      name: data?.name ?? '',
      lastname: data?.lastname ?? '',
      email: data?.email ?? '',
    }
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
    const resp = await usersStore.updateUserById(updateUser)
    if (!!resp) {
      user.value = {
        id: resp?.id ?? 0,
        state: resp?.state ?? '',
        name: resp?.name ?? '',
        lastname: resp?.lastname ?? '',
        email: resp?.email ?? '',
        ...user.value,
      }
      authStore.setUser(user.value)
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
        <div class="w-full flex flex-col gap-1">
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
              {{ form?.errors?.email?.error?.message }}
            </Message>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          </IftaLabel>
        </div>
        <Button class="w-full" label="Обновить" severity="success" type="submit" />
      </div>
    </Form>
  </div>
</template>
