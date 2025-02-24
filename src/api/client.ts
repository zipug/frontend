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
  })
