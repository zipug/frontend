<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useToast } from 'primevue'
import { useProjectsStore } from '@/stores/projects'
import { useBotsStore } from '@/stores/bots'
import type { Project } from '@/models/project'

interface ProjectProps {
  proj: Project
  isCreate: boolean
}

const props = defineProps<ProjectProps>()
const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.getProjects || [])
const isProjectsLoading = ref(false)
const toast = useToast()

const customUserResolver = (values: Project) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    description: { invalid: false, error: {} },
    remote_url: { invalid: false, error: {} },
  }
  if (!values?.project?.name)
    errors.name = { invalid: true, error: { message: 'Название обязательно' } }
  if (!values?.project?.remote_url)
    errors.remote_url = { invalid: true, error: { message: 'Ссылка на проект обязательна' } }
  if (typeof values?.project?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Название должно быть строкой' } }
  if (typeof values?.project?.remote_url !== 'string')
    errors.remote_url = {
      invalid: true,
      error: { message: 'Ссылка на проект должна быть строкой' },
    }
  try {
    values.project.name = values?.project?.name?.trim()
  } catch (err) {
    errors.name = { invalid: true, error: { message: 'Название не может быть пустым' } }
  }
  try {
    values.project.remote_url = values?.project?.remote_url?.trim()
  } catch (err) {
    errors.remote_url = {
      invalid: true,
      error: { message: 'Ссылка на проект не может быть пустой' },
    }
  }

  return {
    values,
    errors,
  }
}

const form = computed(() => {
  if (project.value) {
    const { values, errors } = customUserResolver(project.value)
    return { values, errors }
  }
  return {
    values: {
      project: {
        id: 0,
        name: '',
        description: '',
        remote_url: '',
        user_id: 0,
      },
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      description: { invalid: false, error: { message: '' } },
      remote_url: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const project = ref<Project>({
  project: {
    id: 0,
    name: '',
    description: '',
    remote_url: '',
    user_id: 0,
  },
})

const onFormSubmit = async () => {
  if (isFormValid.value) {
    const { values } = form.value
    if (props.isCreate) {
      const createProject = {
        name: values?.project?.name ?? '',
        description: values?.project?.description ?? '',
        remote_url: values?.project?.remote_url ?? '',
      }
      isProjectsLoading.value = true
      const resp = await projectsStore.createProject(createProject)
      isProjectsLoading.value = false
      if (!!resp) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Проект создан',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось создать проект. Попробуйте позже...',
          life: 3000,
        })
      }
    } else {
      const updateProject = {
        id: values?.project?.id ?? 0,
        name: values?.project?.name ?? '',
        description: values?.project?.description ?? '',
        remote_url: values?.project?.remote_url ?? '',
      }
      isProjectsLoading.value = true
      const resp = await projectsStore.updateProjectById(updateProject)
      isProjectsLoading.value = false
      if (!!resp) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Проект успешно обновлён',
          life: 3000,
        })
        project.value = {
          project: {
            id: resp?.project?.id ?? 0,
            name: resp?.project?.name ?? '',
            description: resp?.project?.description ?? '',
            remote_url: resp?.project?.remote_url ?? '',
            user_id: resp?.project?.user_id ?? 0,
          },
        }
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось обновить проект. Попробуйте позже...',
          life: 3000,
        })
      }
    }
  }
}

watchEffect(() => {
  project.value = {
    project: {
      id: props?.proj?.project?.id ?? 0,
      name: props?.proj?.project?.name ?? '',
      description: props?.proj?.project?.description ?? '',
      remote_url: props?.proj?.project?.remote_url ?? '',
      user_id: props?.proj?.project?.user_id ?? 0,
    },
  }
})
</script>

<template>
  <div>
    <Form
      v-model="project"
      :initialValues="props.proj"
      class="grid gap-4 w-full"
      @submit="() => onFormSubmit()"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="project.project.name"
                fluid
                name="name"
                id="name"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-tag"></i>
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
                v-model="project.project.remote_url"
                fluid
                name="lastname"
                id="lastname"
                type="text"
              />
              <InputGroupAddon>
                <i class="pi pi-tags"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.remote_url?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.remote_url?.error?.message }}
            </Message>
            <label for="lastname" class="block text-sm font-medium text-gray-700">Ссылка</label>
          </IftaLabel>
        </div>
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                id="email"
                v-model="project.project.description"
                type="text"
                fluid
                name="email"
              />
              <InputGroupAddon>
                <i class="pi pi-shield"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.description?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors.description?.error?.message }}
            </Message>
            <label for="email" class="block text-sm font-medium text-gray-700">Описание</label>
          </IftaLabel>
        </div>
        <Button
          :disabled="!isFormValid && isProjectsLoading"
          class="w-full"
          :label="isCreate ? 'Создать' : 'Обновить'"
          severity="success"
          type="submit"
        />
      </div>
    </Form>
  </div>
</template>
