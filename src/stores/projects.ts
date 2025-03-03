import { projectAll } from '@/api/projects/all'
import { projectCreate, type CreateData } from '@/api/projects/create'
import { projectDelete } from '@/api/projects/delete'
import { projectId } from '@/api/projects/id'
import { projectUpdate, type UpdateData } from '@/api/projects/update'
import type { Project } from '@/models/project'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[] | null>([])

  const getProjects = computed<Project[] | null>(() => projects.value)

  async function getAllProjects() {
    try {
      const resp = await projectAll()
      const projectArray = resp.data
      projects.value = projectArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getProjectById(id: number): Promise<Project | null> {
    try {
      const resp = await projectId(id)
      return resp.data as Project
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function deleteProjectById(id: number): Promise<boolean> {
    try {
      const resp = await projectDelete(id)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearProjects()
      await getAllProjects()
    }
  }

  async function createProject(data: CreateData): Promise<boolean> {
    try {
      const resp = await projectCreate(data)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearProjects()
      await getAllProjects()
    }
  }

  async function updateProjectById(data: UpdateData): Promise<Project | null> {
    try {
      const resp = await projectUpdate(data)
      return { project: resp.data } as Project
    } catch (err) {
      console.error(err)
      return null
    } finally {
      clearProjects()
      await getAllProjects()
    }
  }

  function clearProjects() {
    projects.value = []
  }

  return {
    getAllProjects,
    getProjectById,
    clearProjects,
    deleteProjectById,
    createProject,
    updateProjectById,
    getProjects,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
  console.log(`🍍 "${useProjectsStore.$id}" store successfully loaded`)
}
