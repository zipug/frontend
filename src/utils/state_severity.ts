export const getSeverity = (status: string) => {
  switch (status) {
    case 'registered':
      return 'info'

    case 'verified':
      return 'success'

    case 'banned':
      return 'danger'

    case 'deleted':
      return 'danger'
  }
}
