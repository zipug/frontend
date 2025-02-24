import { roleAll } from '@/api/roles/all'
import { roleId } from '@/api/roles/id'
import type { Role } from '@/models/role'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref<Role[] | null>([])

  const getRoles = computed<Role[] | null>(() => roles.value)

  async function getAllRoles() {
    try {
      const resp = await roleAll()
      const RoleArray = resp.data
      roles.value = RoleArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getRoleById(id: number): Promise<Role | null> {
    try {
      const resp = await roleId(id)
      return resp.data as Role
    } catch (err) {
      console.error(err)
      return null
    }
  }

  function clearRoles() {
    roles.value = []
  }

  return { getAllRoles, getRoleById, clearRoles, getRoles }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRolesStore, import.meta.hot))
  console.log(`🍍 "${useRolesStore.$id}" store successfully loaded`)
}
