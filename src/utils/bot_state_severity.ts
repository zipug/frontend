export const getBotSeverity = (status: string) => {
  switch (status) {
    case 'created':
      return 'info'

    case 'running':
      return 'success'

    case 'stopped':
      return 'warn'

    case 'deleted':
      return 'danger'
  }
}

export const getBotStateIcon = (status: string) => {
  switch (status) {
    case 'created':
      return 'pi pi-telegram'

    case 'running':
      return 'pi pi-play'

    case 'stopped':
      return 'pi pi-pause'

    case 'deleted':
      return 'pi pi-times-circle'
  }
}
