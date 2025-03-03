<script lang="ts" setup>
import { computed, ref } from 'vue'
import * as yup from 'yup'
import * as yr from '@primevue/forms/resolvers/yup'
import type { FormFieldState } from '@primevue/forms'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()

interface AuthFormProps {
  type: 'login' | 'register'
}

const formType = computed<typeof props.type>(() => {
  if (route.path === '/login') {
    return 'login'
  } else if (route.path === '/register') {
    return 'register'
  } else {
    return props.type
  }
})

const props = defineProps<AuthFormProps>()
const emits = defineEmits(['login', 'register'])

const loginSchema = yup.object().shape({
  name: yup.string().optional(),
  lastname: yup.string().optional(),
  email: yup.string().lowercase().trim().email().required('Email обязателен'),
  password: yup.string().trim().required('Пароль обязателен'),
  repeat_password: yup.string().optional(),
})

const registerSchema = yup.object().shape({
  name: yup.string().trim().required('Имя обязательно'),
  lastname: yup.string().trim().required('Фамилия обязательна'),
  email: yup.string().lowercase().trim().email().required('Email обязателен'),
  password: yup
    .string()
    .trim()
    .min(6, 'Минимальная длина пароля 6 символов')
    .required('Пароль обязателен'),
  repeat_password: yup
    .string()
    .trim()
    .equals([yup.ref('password')], 'Пароли не совпадают')
    .required('Пароли не совпадают'),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authSchema = formType.value === 'login' ? loginSchema : registerSchema

const resolver = ref(
  formType.value === 'login' ? yr.yupResolver(loginSchema) : yr.yupResolver(registerSchema),
)

type Auth = yup.InferType<typeof authSchema>

type AuthFormSubmit = {
  originalEvent: Event
  values: Auth
  states: Record<string, FormFieldState>
  valid: boolean
  errors: never
  reset: () => void
}

const auth = ref<Auth>({
  name: '',
  lastname: '',
  email: '',
  password: '',
  repeat_password: '',
})

const onFormSubmit = (form: AuthFormSubmit) => {
  if (form.valid) {
    emits(formType.value, form.values)
  }
}
</script>

<template>
  <div class="bg-zinc-900 p-6 shadow rounded-border rounded-lg w-full lg:w-6/12 mx-auto">
    <div class="text-center mb-8">
      <svg
        class="mb-4 mx-auto fill-zinc-200 h-16"
        fill="none"
        viewBox="0 0 165 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M98.0164 149.437C87.5088 144.349 76.9929 144.349 66.4853 149.437C55.9694 154.525 55.9694 162.061 66.4853 172.03C76.9929 182.006 87.5088 182.006 98.0164 172.03C108.524 162.06 108.524 154.525 98.0164 149.437ZM61.6571 143.373C51.1494 148.461 45.5306 145.31 44.8078 133.914C44.0851 122.511 47.3402 117.031 54.5711 117.467C61.801 117.896 67.4209 121.054 71.4193 126.926C75.4188 132.798 72.1647 138.285 61.6571 143.373ZM119.694 133.914C118.972 145.31 113.352 148.461 102.845 143.373C92.337 138.285 89.0829 132.798 93.0824 126.926C97.0818 121.054 102.701 117.896 109.932 117.467C117.163 117.031 120.417 122.511 119.694 133.914ZM143.272 106.315C133.486 112.623 128.233 121.475 127.511 132.879C126.788 144.275 133.495 148.039 147.629 144.171C161.764 140.304 167.017 131.451 163.39 117.615C159.764 103.771 153.065 100.007 143.272 106.315ZM36.9919 132.879C36.2691 121.475 31.0153 112.623 21.2304 106.315C11.4363 100.007 4.72969 103.771 1.11062 117.615C-2.51565 131.452 2.73817 140.304 16.8721 144.171C31.0081 148.039 37.7136 144.275 36.9919 132.879ZM88.2542 114.465C84.3168 113.474 80.1849 113.474 76.2475 114.465C72.2408 115.455 72.2408 118.895 76.2475 124.766C80.247 130.638 84.2547 130.638 88.2542 124.766C92.2537 118.894 92.2537 115.456 88.2542 114.465ZM63.2466 107.165C62.128 103.298 60.1282 99.9327 57.2474 97.0557C54.3583 94.1787 51.3016 95.8948 48.0773 102.203C44.8459 108.511 46.8456 111.883 54.0766 112.32C61.3075 112.749 64.3642 111.033 63.2466 107.165ZM107.254 97.0557C104.373 99.9327 102.374 103.298 101.256 107.166C100.137 111.033 103.194 112.749 110.425 112.32C117.656 111.884 119.656 108.511 116.424 102.203C113.193 95.8948 110.136 94.1787 107.254 97.0557ZM140.292 80.2907C150.078 86.5987 150.078 92.9068 140.292 99.2158C130.499 105.524 123.989 105.524 120.766 99.2158C117.535 92.9068 117.535 86.5987 120.766 80.2907C123.989 73.9827 130.499 73.9827 140.292 80.2907ZM24.21 99.2158C14.4241 92.9068 14.4241 86.5987 24.21 80.2907C33.9959 73.9827 40.504 73.9827 43.7355 80.2907C46.9669 86.5987 46.9669 92.9068 43.7355 99.2158C40.504 105.524 33.9959 105.524 24.211 99.2158H24.21ZM101.256 72.3408C102.341 76.1534 104.405 79.6349 107.254 82.4577C110.136 85.3277 113.193 83.6107 116.425 77.3027C119.656 70.9947 117.656 67.6227 110.425 67.1927C103.194 66.7577 100.137 68.4728 101.256 72.3408ZM57.2474 82.4577C60.0971 79.635 62.1616 76.1535 63.2466 72.3408C64.3642 68.4728 61.3075 66.7577 54.0755 67.1937C46.8456 67.6227 44.8459 70.9947 48.0773 77.3037C51.3016 83.6107 54.3573 85.3267 57.2474 82.4577ZM127.511 46.6348C128.233 58.0308 133.486 66.8828 143.272 73.1908C153.065 79.4998 159.764 75.7348 163.391 61.8988C167.017 48.0548 161.764 39.2028 147.63 35.3348C133.495 31.4668 126.788 35.2308 127.511 46.6348ZM21.2294 73.1908C31.0153 66.8828 36.2691 58.0308 36.9908 46.6348C37.7136 35.2308 31.007 31.4668 16.8731 35.3348C2.73817 39.2028 -2.51565 48.0548 1.11164 61.8988C4.73072 75.7348 11.4363 79.4988 21.2294 73.1908ZM76.2475 65.0407C80.247 66.0327 84.2547 66.0327 88.2542 65.0407C92.2537 64.0507 92.2537 60.6187 88.2542 54.7407C84.2547 48.8677 80.247 48.8677 76.2475 54.7407C72.2408 60.6187 72.2408 64.0507 76.2475 65.0407ZM102.846 36.1338C113.353 31.0458 118.972 34.2038 119.694 45.5998C120.417 56.9958 117.163 62.4827 109.932 62.0467C102.701 61.6097 97.0818 58.4597 93.0824 52.5807C89.0829 46.7087 92.338 41.2288 102.846 36.1338ZM44.8078 45.5998C45.5306 34.2038 51.1494 31.0458 61.6571 36.1338C72.1647 41.2288 75.4188 46.7087 71.4193 52.5807C67.4198 58.4607 61.801 61.6107 54.5711 62.0467C47.3402 62.4827 44.0851 56.9958 44.8078 45.5998ZM66.4853 30.0698C76.9929 35.1648 87.5088 35.1648 98.0164 30.0698C108.524 24.9818 108.524 17.4527 98.0164 7.47675C87.5088 -2.49225 76.9929 -2.49225 66.4853 7.47675C55.9694 17.4527 55.9694 24.9818 66.4853 30.0698Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
      <div v-if="formType === 'register'">
        <div class="text-zinc-50 text-3xl font-medium mb-4">Создать аккаунт</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal"
          >Уже есть аккаунт?</span
        >
        <a
          class="font-medium no-underline ml-2 text-primary cursor-pointer text-violet-400"
          @click.stop="router.push('login')"
          >Войдите прямо сейчас!</a
        >
      </div>
      <div v-else>
        <div class="text-zinc-50 text-3xl font-medium mb-4">Войти в аккаунт</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal"
          >Нет аккаунта?</span
        >
        <a
          class="font-medium no-underline ml-2 text-primary cursor-pointer text-violet-400"
          @click.stop="router.push('register')"
          >Создайте прямо сейчас!</a
        >
      </div>
    </div>
    <div>
      <Form
        v-slot="$form"
        v-model="auth"
        :resolver="resolver"
        class="grid gap-4 w-full"
        @submit="(val: any) => onFormSubmit(val)"
      >
        <div class="flex flex-col justify-center items-center gap-4">
          <div v-if="formType === 'register'" class="w-full flex flex-row gap-4">
            <IftaLabel class="w-full">
              <InputGroup>
                <InputText
                  class="w-full"
                  v-model="auth.name"
                  fluid
                  name="name"
                  id="name"
                  type="text"
                />
                <InputGroupAddon>
                  <i class="pi pi-user"></i>
                </InputGroupAddon>
              </InputGroup>
              <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                {{ $form.name?.error?.message }}
              </Message>
              <label for="name" class="block text-sm font-medium text-gray-700">Имя</label>
            </IftaLabel>
            <IftaLabel class="w-full">
              <InputGroup>
                <InputText
                  class="w-full"
                  v-model="auth.lastname"
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
                v-if="$form.lastname?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.lastname?.error?.message }}
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
                  v-model="auth.email"
                  fluid
                  name="email"
                  type="text"
                />
                <InputGroupAddon>
                  <i class="pi pi-at"></i>
                </InputGroupAddon>
              </InputGroup>
              <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                {{ $form.email?.error?.message }}
              </Message>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            </IftaLabel>
          </div>
          <div class="w-full flex flex-col gap-1">
            <IftaLabel>
              <InputGroup>
                <Password
                  v-model="auth.password"
                  :feedback="formType === 'register'"
                  fluid
                  id="password"
                  name="password"
                  toggle-mask
                  type="password"
                >
                  <template #header>
                    <div v-if="formType === 'register'" class="font-semibold text-xm mb-4">
                      Введите пароль
                    </div>
                  </template>
                  <template #footer>
                    <div v-if="formType === 'register'">
                      <Divider />
                      <ul class="pl-2 ml-2 my-0 leading-normal">
                        <li class="mb-1">Длина не менее 10 символов</li>
                        <li class="mb-1">Пароль должен содержать как минимум 1 цифру</li>
                        <li class="mb-1">
                          Пароль должен содержать как минимум 1 специальный символ
                        </li>
                      </ul>
                    </div>
                  </template>
                </Password>
                <InputGroupAddon>
                  <i class="pi pi-lock"></i>
                </InputGroupAddon>
              </InputGroup>
              <Message
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.password?.error?.message }}
              </Message>
              <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
            </IftaLabel>
          </div>
          <div v-if="formType === 'register'" class="w-full flex flex-col gap-1">
            <IftaLabel>
              <InputGroup>
                <Password
                  v-model="auth.repeat_password"
                  fluid
                  name="repeat_password"
                  id="repeat_password"
                  toggle-mask
                  type="password"
                >
                  <template #header>
                    <div class="font-semibold text-xm mb-4">Введите пароль</div>
                  </template>
                  <template #footer>
                    <Divider />
                    <ul class="pl-2 ml-2 my-0 leading-normal">
                      <li class="mb-1">Длина не менее 10 символов</li>
                      <li class="mb-1">Пароль должен содержать как минимум 1 цифру</li>
                      <li class="mb-1">Пароль должен содержать как минимум 1 специальный символ</li>
                    </ul>
                  </template>
                </Password>
                <InputGroupAddon>
                  <i class="pi pi-lock"></i>
                </InputGroupAddon>
              </InputGroup>
              <Message
                v-if="$form.repeat_password?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.repeat_password?.error?.message }}
              </Message>
              <label for="password" class="block text-sm font-medium text-gray-700"
                >Повторите пароль</label
              >
            </IftaLabel>
          </div>
          <Button
            class="w-full"
            :label="formType === 'login' ? 'Войти' : 'Зарегестировать'"
            severity="success"
            type="submit"
          />
        </div>
        <Fieldset v-if="false" class="h-80 overflow-auto" legend="Form States">
          <pre class="whitespace-pre-wrap">{{ $form }}</pre>
        </Fieldset>
      </Form>
    </div>
  </div>
</template>
