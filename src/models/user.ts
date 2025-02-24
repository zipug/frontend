import type { Role } from './role'

export interface User {
  id?: number
  email?: string
  name?: string
  lastname?: string
  role?: Role
  state?: string
}
