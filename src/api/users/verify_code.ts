import { USERS_PATH } from '@/constants/api.ts'
import { api } from '@/api/client.ts'

const VERIFY_CODE_PATH = USERS_PATH + 'verify'

export interface VerifyCodeData {
  code: number
}

export interface VerifyCodeResponse {
  data: string[]
  errors: string[] | null
  status: 'success' | 'failed'
}

export const userVerifyCode = async (data: VerifyCodeData): Promise<VerifyCodeResponse> => {
  try {
    const response = await api().post<VerifyCodeResponse>(VERIFY_CODE_PATH, data)
    return response.data
  } catch (error) {
    return {
      data: [],
      errors: [JSON.stringify(error)],
      status: 'failed',
    }
  }
}
