export interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

export interface Permission {
  name: string
  description: string
  do_create: boolean
  do_update: boolean
  do_read: boolean
  do_delete: boolean
}
