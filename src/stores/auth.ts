import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getClaims } from '@/utils/jwt'
import type { User } from '@/models/user'
import { useRouter } from 'vue-router'
import { userMe } from '@/api/users/me'
import { userSendCode } from '@/api/users/send_code'
import { userVerifyCode } from '@/api/users/verify_code'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || '{}') as User)
  const router = useRouter()

  const getUserData = computed<User | null>(() => user.value)
  const getInitials = computed<string>(() => {
    if (user.value !== null) {
      return `${user.value.name?.charAt(0) || ''}${user.value.lastname?.charAt(0) || ''}`
    }
    return ''
  })
  const isAuth = computed<boolean>(() => !!localStorage.getItem('token'))

  async function login(token: string) {
    try {
      user.value = {}
      const payload = getClaims(token)
      if (payload !== null && 'user_id' in payload) {
        if (user.value !== null) {
          user.value.id = payload.user_id
          localStorage.setItem('token', token)
        }
      }
      const resp = await userMe()
      if (resp.status === 'success') {
        user.value = { ...user.value, ...resp.data }
        localStorage.setItem('user', JSON.stringify(user.value))
        router.push('/')
      }
    } catch (err) {
      console.error(err)
    }
  }

  function can(permission: string): boolean {
    if (!permission) return true
    const [action, permname] = permission.split(':')
    if (user.value !== null) {
      const perms = user.value.role?.permissions
      if (Array.isArray(perms) && perms?.length > 0) {
        for (let i = 0; i < perms.length; i++) {
          if (perms[i].name === permname && action in perms[i]) {
            const perm = Object.fromEntries(Object.entries(perms[i]))
            if (!!perm?.[action]) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
  }

  function setUser(usr: User) {
    Object.entries(usr).forEach(([key, val]) => {
      user.value = { ...user.value, [key]: val }
    })
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function verifyEmail(): Promise<boolean> {
    if (!!user.value?.email) {
      const resp = await userSendCode({ email: user.value?.email })
      if (resp.status === 'success' && resp.data.length > 0) {
        if (resp.data[0] === 'Your verification code has been sent') return true
        return false
      }
      return false
    }
    return false
  }

  async function verifyOtp(otp: number): Promise<boolean> {
    if (user.value) {
      const resp = await userVerifyCode({ code: otp })
      if (resp.status === 'success' && resp.data.length > 0) {
        if (resp.data[0] === 'successfully verified') {
          user.value.state = 'verified'
          return true
        }
        return false
      }
      return false
    }
    return false
  }

  return {
    user,
    isAuth,
    getUserData,
    getInitials,
    login,
    logout,
    setUser,
    can,
    verifyEmail,
    verifyOtp,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
  console.log(`🍍 "${useAuthStore.$id}" store successfully loaded`)
}
