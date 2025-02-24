<script setup lang="ts">
import UserProfileForm from '@/components/UserProfileForm.vue'
import { useUsersStore } from '@/stores/users'
import { getSeverity } from '@/utils/state_severity'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const usersStore = useUsersStore()
const route = useRoute()
const user = ref()

const initials = computed(() => {
  if (user.value !== null) {
    return `${user.value?.name?.charAt(0) || ''}${user.value?.lastname?.charAt(0) || ''}`
  }
  return ''
})

onMounted(async () => {
  const { id } = route.params
  user.value = await usersStore.getUserById(+id)
})
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
          <Tag :value="user?.state" :severity="getSeverity(user?.state)" />
        </span>
      </template>
      <template #content>
        <div class="space-y-4">
          <UserProfileForm :usr="user" />
        </div>
      </template>
    </Card>
  </div>
</template>
