import { adaptAffiliations } from '@/api/auth/adapters/affiliation'
import { adaptUser } from '@/api/auth/adapters/user'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import type { User } from '@/domain/user/user.types'
import axiosClient from '../axiosClient'

export interface LoginFormRequest {
  requestRut: string
  requestPassword: string
}

const AUTH_LOGIN_ENDPOINT = '/api/auth/session/login'

export interface LoginFormResponse {
  user: User
  affiliations: Affiliation[]
  token: string
  message: string
}

export const authUser = async (request: LoginFormRequest): Promise<LoginFormResponse> => {
  const loginPayload = {
    ...request,
    requestRut: Number(request.requestRut),
  }

  try {
    const response = await axiosClient.post(AUTH_LOGIN_ENDPOINT, loginPayload)
    await saveToken(response.data.token.tokenString)

    const affiliations = adaptAffiliations(response.data.affiliations)
    const user = adaptUser(response.data.user, affiliations)
    return {
      user,
      affiliations,
      token: response.data.token.tokenString,
      message: response.data.message,
    }
  } catch (error) {
    console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

const saveToken = async (token: string) => {
  await cookieStore.set({
    name: 'token',
    value: token,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
    sameSite: 'lax',
  })
}
