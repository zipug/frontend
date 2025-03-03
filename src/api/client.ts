import axios from 'axios'
import { BASE_URL } from '@/constants/api.ts'

export const api = () =>
  axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    validateStatus: (status: number) => {
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return false
      }
      return true
    },
  })
