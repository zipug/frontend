import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const SEND_CODE_PATH = USERS_PATH + 'send-code'

export interface SendCodeData {
  email: string
}

export interface SendCodeResponse {
  data: string[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userSendCode = async (data: SendCodeData): Promise<SendCodeResponse> => {
  try {
    const response = await api().post<SendCodeResponse>(SEND_CODE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
