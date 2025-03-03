export const getRoleSeverity = (role: string) => {
  switch (role) {
    case 'admin':
      return 'success'

    case 'support':
      return 'info'

    case 'user':
      return 'warn'
  }
}
