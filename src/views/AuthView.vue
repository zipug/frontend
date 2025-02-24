<script lang="ts" setup>
import AuthForm from '@/components/AuthForm.vue'
import { type LoginData, type LoginResponse, userLogin } from '@/api/users/login'
import { type RegisterData, userRegister } from '@/api/users/register'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue'

const toast = useToast()

interface AuthViewProps {
  type: 'login' | 'register'
}

const errorWrapper = (errors: string[]): string => {
  const ruErrs: string[] = []
  errors.forEach((val: string) => {
    if (val === 'email is empty') ruErrs.push('Отсутствует email')
    if (val === 'password is empty') ruErrs.push('Отсутствует пароль')
    if (val === 'repeat password is empty') ruErrs.push('Поле для проверки пароля обязательно')
    if (val === 'name is empty') ruErrs.push('Отсутствует имя пользователя')
    if (val === 'lastname is empty') ruErrs.push('Отсутствует фамилия пользователя')
    if (val === 'password does not match') ruErrs.push('Неверный пароль')
    if (val === 'invalid email') ruErrs.push('Неверный email')
  })
  return ruErrs.join(', ')
}

const onSuccess = (data: LoginResponse) => {
  if (data.status === 'failed') {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: data?.errors ? errorWrapper(data?.errors) : 'Произошла неизвестная ошибка',
      life: 3000,
    })
    return
  }
  authStore.login(data.data.token)
  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: props.type === 'login' ? 'Пользователь авторизован' : 'Пользователь зарегистрирован',
    life: 3000,
  })
}
const onError = (err: unknown) => {
  toast.add({
    severity: 'error',
    summary: 'Ошибка',
    detail: `Произошла неизвестная ошибка: ${err}`,
    life: 3000,
  })
}

const authStore = useAuthStore()
const props = defineProps<AuthViewProps>()

const onLogin = async (data: LoginData) => {
  const resp = await userLogin(data)
  if (resp.status === 'failed') {
    onError(resp)
    return
  }
  onSuccess(resp)
}
const onRegister = async (data: RegisterData) => {
  const resp = await userRegister(data)
  if (resp.status === 'failed') {
    onError(resp)
    return
  }
  onSuccess(resp)
}
</script>

<template>
  <AuthForm
    :type="props.type"
    @login="(data) => onLogin(data)"
    @register="(data) => onRegister(data)"
  />
</template>
