import type { Role } from './role'

export interface User {
  id?: number
  email?: string
  name?: string
  lastname?: string
  role?: Role
  state?: string
  password?: string
  repeat_password?: string
}
