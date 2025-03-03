export interface Resources {
  cpu: {
    cores: number
    usage: number
  }
  ram: {
    usage: number
    total: number
    used: number
    free: number
  }
  hdd: {
    partition: string
    usage: number
    total: number
    used: number
    free: number
  }
}

export const defaultResources: Resources = {
  cpu: {
    usage: 0,
    cores: 0,
  },
  ram: {
    usage: 0,
    total: 0,
    used: 0,
    free: 0,
  },
  hdd: {
    partition: '',
    usage: 0,
    total: 0,
    used: 0,
    free: 0,
  },
}
