<script setup lang="ts">
import ProjectForm from '@/components/ProjectForm.vue'
import { useProjectsStore } from '@/stores/projects'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface botProps {
  isCreate: boolean
}

const props = defineProps<botProps>()

const router = useRouter()
const projectStore = useProjectsStore()
const route = useRoute()
const project = ref()

onMounted(async () => {
  const { id } = route.params
  if (!props.isCreate) {
    if (Number.isNaN(+id)) {
      router.push({ name: 'NotFound' })
      return
    }
    project.value = await projectStore.getProjectById(+id)
  } else
    project.value = {
      project: {
        id: 0,
        name: '',
        description: '',
        remote_url: '',
        user_id: 0,
      },
    }
})
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 pt-0 pb-8 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">{{
            isCreate ? 'Создание проекта' : 'Редактирование проекта'
          }}</span>
        </span>
      </template>
      <template #content>
        <div class="space-y-4">
          <ProjectForm :proj="project" :is-create="isCreate" />
        </div>
      </template>
    </Card>
  </div>
</template>
