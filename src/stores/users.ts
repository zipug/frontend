import { userAll } from '@/api/users/all'
import { userId } from '@/api/users/id'
import { userRegister, type RegisterData } from '@/api/users/register'
import { userUpdate, type UpdateData } from '@/api/users/update'
import type { User } from '@/models/user'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[] | null>([])

  const getUsers = computed<User[] | null>(() => users.value)

  async function getAllUsers() {
    try {
      const resp = await userAll()
      const userArray = resp.data
      users.value = userArray
    } catch (err) {
      console.error(err)
    }
  }

  async function getUserById(id: number): Promise<User | null> {
    try {
      const resp = await userId(id)
      return resp.data as User
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async function updateUserById(data: UpdateData): Promise<User | null> {
    try {
      const resp = await userUpdate(data)
      if (resp.status === 'success') {
        return resp.data as User
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    } finally {
      clearUsers()
    }
  }

  async function registerUser(data: RegisterData): Promise<boolean> {
    try {
      const resp = await userRegister(data)
      if (resp.status === 'success') {
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    } finally {
      clearUsers()
    }
  }

  function clearUsers() {
    users.value = []
  }

  return { getAllUsers, getUserById, clearUsers, getUsers, updateUserById, registerUser }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
  console.log(`🍍 "${useUsersStore.$id}" store successfully loaded`)
}
