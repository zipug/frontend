<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useToast } from 'primevue'
import type { Bot } from '@/models/bot'
import { useProjectsStore } from '@/stores/projects'
import { useBotsStore } from '@/stores/bots'
import type { Project } from '@/models/project'

interface BotProps {
  bot: Bot
  isCreate: boolean
}

const props = defineProps<BotProps>()
const projectsStore = useProjectsStore()
const projects = computed(() => projectsStore.getProjects || [])
const botsStore = useBotsStore()
const isProjectsLoading = ref(false)
const isBotLoading = ref(false)
const toast = useToast()

const customUserResolver = (values: Bot) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    description: { invalid: false, error: {} },
    api_token: { invalid: false, error: {} },
    project_id: { invalid: false, error: {} },
  }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Название обязательно' } }
  if (!values?.api_token)
    errors.api_token = { invalid: true, error: { message: 'API Token обязателен' } }
  if (!values?.project_id)
    errors.project_id = { invalid: true, error: { message: 'Бот обязательно привязан к проекту' } }
  if (typeof values?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Название должно быть строкой' } }
  if (typeof values?.api_token !== 'string')
    errors.api_token = { invalid: true, error: { message: 'API Token должен быть строкой' } }
  try {
    values.name = values?.name?.trim()
  } catch (err) {
    errors.name = { invalid: true, error: { message: 'Название не может быть пустым' } }
  }
  try {
    values.api_token = values?.api_token?.trim()
  } catch (err) {
    errors.api_token = { invalid: true, error: { message: 'API Token не может быть пустым' } }
  }

  return {
    values,
    errors,
  }
}

const form = computed(() => {
  if (bot.value) {
    const { values, errors } = customUserResolver(bot.value)
    return { values, errors }
  }
  return {
    values: {
      id: 0,
      name: '',
      description: '',
      icon: '',
      api_token: '',
      project_id: 0,
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      description: { invalid: false, error: { message: '' } },
      api_token: { invalid: false, error: { message: '' } },
      project_id: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)

const bot = ref<Bot>({
  id: 0,
  name: '',
  description: '',
  icon: '',
  api_token: '',
  project_id: 0,
})

const onFormSubmit = async () => {
  if (isFormValid.value) {
    const { values } = form.value
    if (props.isCreate) {
      const createBot = {
        name: values?.name ?? '',
        description: values?.description ?? '',
        icon: values?.icon ?? '',
        project_id: values?.project_id ?? 0,
        api_token: values?.api_token ?? '',
      }
      isBotLoading.value = true
      const resp = await botsStore.createBot(createBot)
      isBotLoading.value = false
      if (!!resp) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Бот успешно создан',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось создать бота. Попробуйте позже...',
          life: 3000,
        })
      }
    } else {
      const updateBot = {
        id: values?.id ?? 0,
        name: values?.name ?? '',
        description: values?.description ?? '',
        project_id: values?.project_id ?? 0,
        api_token: values?.api_token ?? '',
      }
      isBotLoading.value = true
      const resp = await botsStore.updateBotById(updateBot)
      isBotLoading.value = false
      if (!!resp) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Бот успешно обновлён',
          life: 3000,
        })
        bot.value = {
          id: resp?.id ?? 0,
          name: resp?.name ?? '',
          description: resp?.description ?? '',
          api_token: resp?.api_token ?? '',
          project_id: resp?.project_id ?? 0,
        }
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось обновить бота. Попробуйте позже...',
          life: 3000,
        })
      }
    }
  }
}

watchEffect(() => {
  bot.value = {
    id: props?.bot?.id ?? 0,
    name: props?.bot?.name ?? '',
    description: props?.bot?.description ?? '',
    api_token: props?.bot?.api_token ?? '',
    project_id: props?.bot?.project_id ?? 0,
  }
})
const currentProject = computed(() => {
  return projects.value?.find((el: Project) => el?.project?.id === bot.value.project_id)
})
const updateProjectId = (val: any) => {
  bot.value.project_id = val?.project?.id
}

onMounted(async () => {
  isProjectsLoading.value = true
  await projectsStore.getAllProjects()
  isProjectsLoading.value = false
})
</script>

<template>
  <div>
    <Form
      v-model="bot"
      :initialValues="props.bot"
      class="grid gap-4 w-full"
      @submit="() => onFormSubmit()"
    >
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <InputText
                class="w-full"
                v-model="bot.name"
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
                v-model="bot.description"
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
              v-if="form?.errors?.description?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.description?.error?.message }}
            </Message>
            <label for="lastname" class="block text-sm font-medium text-gray-700">Описание</label>
          </IftaLabel>
        </div>
        <div class="w-full flex flex-row gap-4">
          <IftaLabel class="w-full">
            <InputGroup>
              <Password
                class="w-full"
                id="email"
                v-model="bot.api_token"
                toggle-mask
                :feedback="false"
                fluid
                name="email"
              />
              <InputGroupAddon>
                <i class="pi pi-shield"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.api_token?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors.api_token?.error?.message }}
            </Message>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Telegram API Token</label
            >
          </IftaLabel>
          <IftaLabel class="w-full">
            <InputGroup>
              <Select
                class="w-full"
                id="project_id"
                :model-value="currentProject"
                @update:model-value="(val) => updateProjectId(val)"
                :options="projects"
                checkmark
                :disabled="!isCreate"
                optionLabel="project.name"
                type="text"
              >
                <template #empty>Нет доступных проектов для выбора</template>
                <template #option="slotProps">
                  <div class="flex items-center gap-4">
                    <span class="min-w-32">
                      {{ slotProps.option.project.name }}
                    </span>
                    <span class="text-gray-400">
                      {{ slotProps.option.project.description }}
                    </span>
                  </div>
                </template>
              </Select>
              <InputGroupAddon>
                <i class="pi pi-server"></i>
              </InputGroupAddon>
            </InputGroup>
            <Message
              v-if="form?.errors?.project_id?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ form?.errors?.project_id?.error?.message }}
            </Message>
            <label for="project_id" class="block text-sm font-medium text-gray-700">Проект</label>
          </IftaLabel>
        </div>
        <Button
          :disabled="!isFormValid && isBotLoading"
          class="w-full"
          :label="isCreate ? 'Создать' : 'Обновить'"
          severity="success"
          type="submit"
        />
      </div>
    </Form>
  </div>
</template>
