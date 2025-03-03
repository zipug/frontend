<script setup lang="ts">
import { useArticlesStore } from '@/stores/articles'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor, config, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { EDITOR_CONFIG, EXCLUDE_TOOLBARS } from '@/constants/editor'
import type { Article } from '@/models/article'
import { useToast } from 'primevue'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/models/project'

interface articleProps {
  isCreate: boolean
}
const props = defineProps<articleProps>()
config({
  editorConfig: EDITOR_CONFIG,
})
const articlesStore = useArticlesStore()
const projectsStore = useProjectsStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const customUserResolver = (values: Article) => {
  const errors: any = {
    name: { invalid: false, error: {} },
    description: { invalid: false, error: {} },
    project_id: { invalid: false, error: {} },
    content: { invalid: false, error: {} },
  }
  if (!values?.project_id)
    errors.project_id = {
      invalid: true,
      error: { message: 'Статья обязательно должна быть привязана к проекту' },
    }
  if (!values?.content)
    errors.content = { invalid: true, error: { message: 'Статья не должна быть пустой' } }
  if (!values?.name) errors.name = { invalid: true, error: { message: 'Название обязательно' } }
  if (typeof values?.name !== 'string')
    errors.name = { invalid: true, error: { message: 'Название должно быть строкой' } }
  try {
    values.name = values?.name?.trim()
  } catch (err) {
    errors.name = { invalid: true, error: { message: 'Название не может быть пустым' } }
  }

  return {
    values,
    errors,
  }
}
const form = computed(() => {
  if (article.value) {
    const { values, errors } = customUserResolver(article.value)
    return { values, errors }
  }
  return {
    values: {
      id: 0,
      project_id: 0,
      name: '',
      description: '',
      content: '',
    },
    errors: {
      name: { invalid: false, error: { message: '' } },
      project_id: { invalid: false, error: { message: '' } },
      description: { invalid: false, error: { message: '' } },
      content: { invalid: false, error: { message: '' } },
    },
  }
})
const isFormValid = computed(() =>
  Object.values(form.value?.errors)?.every((el: any) => !el?.invalid),
)
const article = ref({
  id: 0,
  project_id: 0,
  name: '',
  description: '',
  content: '',
})
const projects = computed(() => projectsStore.getProjects || [])
const updateContent = (val: string) => {
  article.value.content = val
}
const onFormSubmit = async () => {
  if (isFormValid.value) {
    if (props.isCreate) {
      const resp = await articlesStore.createArticle(article.value)
      if (!!resp) {
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Статья успешно создана',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось создать статью',
          life: 3000,
        })
      }
    } else {
      const resp = await articlesStore.updateArticleById(article.value)
      if (!!resp) {
        article.value = {
          id: resp?.id ?? 0,
          project_id: resp?.project_id ?? 0,
          name: resp?.name ?? '',
          description: resp?.description ?? '',
          content: resp?.content ?? '',
        }
        toast.add({
          severity: 'success',
          summary: 'Успешно',
          detail: 'Статья успешно обновлена',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось обновить статью',
          life: 3000,
        })
      }
    }
  }
}
const currentProject = computed(() => {
  return projects.value?.find((el: Project) => el?.project?.id === article.value.project_id)
})
const updateProjectId = (val: any) => {
  article.value.project_id = val?.project?.id
}
onMounted(async () => {
  await projectsStore.getAllProjects()
  const { id } = route.params
  if (!Number.isNaN(+id)) {
    const resp = await articlesStore.getArticleById(+id)
    if (!resp) {
      router.push({ name: 'NotFound' })
    } else {
      article.value = resp
    }
  }
})
onUnmounted(() => {
  projectsStore.clearProjects()
})
</script>

<template>
  <div
    class="flex justify-center items-center bg-zinc-900 px-8 py-0 border-solid border-zinc-700 border-[1px] rounded-lg"
  >
    <Card class="shadow-lg w-full min-w-screen">
      <template #title>
        <span class="flex flex-row gap-4">
          <span class="text-2xl">{{ isCreate ? 'Создать статью' : 'Редактировать статью' }}</span>
        </span>
      </template>
      <template #content>
        <Accordion value="0">
          <AccordionPanel value="0">
            <AccordionHeader>Информация</AccordionHeader>
            <AccordionContent>
              <Form v-model="article" class="grid gap-4 w-full">
                <div class="flex flex-col justify-center items-center gap-4">
                  <IftaLabel class="w-full" v-if="isCreate">
                    <InputGroup>
                      <Select
                        class="w-full"
                        id="project_id"
                        :model-value="currentProject"
                        @update:model-value="(val) => updateProjectId(val)"
                        :options="projects"
                        checkmark
                        type="text"
                        optionLabel="project.name"
                      >
                        <template #empty>Нет доступных проектов для выбора</template>
                        <template #option="slotProps">
                          <div class="flex items-center gap-4">
                            <span class="min-w-32">
                              {{ slotProps.option?.project?.name || '' }}
                            </span>
                            <span class="text-gray-400">
                              {{ slotProps.option?.project?.description || '' }}
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
                    <label for="project_id" class="block text-sm font-medium text-gray-700"
                      >Проект</label
                    >
                  </IftaLabel>
                  <div class="w-full flex flex-row gap-4">
                    <IftaLabel class="w-full">
                      <InputGroup>
                        <InputText
                          class="w-full"
                          v-model="article.name"
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
                      <label for="name" class="block text-sm font-medium text-gray-700"
                        >Название</label
                      >
                    </IftaLabel>
                    <IftaLabel class="w-full">
                      <InputGroup>
                        <InputText
                          class="w-full"
                          v-model="article.description"
                          fluid
                          name="description"
                          id="description"
                          type="text"
                        />
                        <InputGroupAddon>
                          <i class="pi pi-pencil"></i>
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
                      <label for="description" class="block text-sm font-medium text-gray-700"
                        >Описание</label
                      >
                    </IftaLabel>
                  </div>
                </div>
              </Form>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>Контент</AccordionHeader>
            <AccordionContent>
              <MdEditor
                :model-value="article?.content"
                @update:model-value="(val) => updateContent(val)"
                @on-save="console.log($event)"
                code-theme="github"
                theme="dark"
                preview-theme="github"
                language="ru"
                :toolbars-exclude="EXCLUDE_TOOLBARS"
              />
              <Message
                v-if="form?.errors?.content?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ form?.errors?.content?.error?.message }}
              </Message>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <Button type="button" @click="router.back()" label="Отмена" />
          <Button
            type="submit"
            :disabled="!isFormValid"
            label="Сохранить"
            @click="() => onFormSubmit()"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style>
.md-editor-dark {
  --md-bk-color: var(--p-zinc-800) !important;
  min-height: 55dvh;
}
svg.md-editor-icon {
  width: 1.5rem !important;
  height: 1.5rem !important;
}
.md-editor-menu-item {
  font-size: 16px;
  padding: 8px 20px;
}
</style>
