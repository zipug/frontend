<script setup lang="ts">
import ProfileForm from '@/components/ProfileForm.vue'
import { useAuthStore } from '@/stores/auth'
import { getSeverity } from '@/utils/state_severity'
import { useToast } from 'primevue'
import { computed, ref } from 'vue'

const toast = useToast()
const authStore = useAuthStore()
const user = computed(() => authStore.getUserData)
const initials = computed(() => authStore.getInitials)
const isDialog = ref(false)
const isResend = ref(false)
const otp = ref()

const resendEmail = async () => {
  await verifyEmail()
  isResend.value = true
  setTimeout(() => {
    isResend.value = false
  }, 5000)
}

const submitCode = async () => {
  const otp_code = otp.value
  otp.value = null
  if (otp_code) {
    const ok = await authStore.verifyOtp(+otp_code)
    if (ok) {
      isDialog.value = false
      toast.add({
        severity: 'success',
        summary: 'Подтверждено',
        detail: 'Email успешно подтверждён',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось подтвердить email',
        life: 3000,
      })
    }
  }
}

const verifyEmail = async () => {
  const ok = await authStore.verifyEmail()
  if (ok) {
    toast.add({
      severity: 'info',
      summary: 'Отправлено',
      detail: 'На вашу почту отправлено письмо с подтверждением',
      life: 3000,
    })
    isDialog.value = true
  } else {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось подтвердить почту',
      life: 3000,
    })
  }
}
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #header>
        <div class="flex justify-start pt-8 pl-4">
          <Avatar
            :label="initials"
            size="xlarge"
            shape="circle"
            class="mb-4"
            style="background-color: #ece9fc; color: #2a1261"
          />
        </div>
      </template>
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">Профиль</span>
          <Tag :value="user?.state" :severity="getSeverity(user?.state || '')" />
          <Button
            v-if="user?.state === 'registered'"
            size="small"
            icon="pi pi-verified"
            label="Подтвердить почту"
            rounded
            severity="info"
            outlined
            class="ml-auto"
            @click="() => verifyEmail()"
          />
        </span>
      </template>
      <template #content>
        <div class="space-y-4">
          <ProfileForm />
        </div>
      </template>
    </Card>
    <Dialog v-model:visible="isDialog" modal class="min-w-96">
      <template #header>
        <span class="font-bold whitespace-nowrap text-xl">Подтвердить email</span>
      </template>
      <div class="flex flex-col items-center justify-center mb-4">
        <p class="text-gray-300 block mt-2 mb-4">Пожалуйста, введите код</p>
        <InputOtp class="" size="large" v-model="otp" :length="6" integerOnly />
        <Button
          label="Отправить повторно"
          link
          class="p-0"
          :disabled="isResend"
          @click="() => resendEmail()"
        ></Button>
      </div>
      <template #footer>
        <Button label="Отменить" text severity="secondary" @click="isDialog = false" autofocus />
        <Button
          label="Подтвердить"
          outlined
          severity="success"
          :disabled="!otp"
          @click="() => submitCode()"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>
