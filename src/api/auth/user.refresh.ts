import { adaptAffiliations } from '@/api/auth/adapters/affiliation'
import { adaptUser } from '@/api/auth/adapters/user'
import axiosClient from '@/api/axiosClient'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import type { User } from '@/domain/user/user.types'
export interface SessionRefreshResponse {
  user: User
  affiliations: Affiliation[]
  message: string
}

export const refreshUserSession = async (): Promise<SessionRefreshResponse> => {
  try {
    const response = await axiosClient.post('/api/auth/session/refresh')

    console.log('Session refresh successful:', response.data)

    // Process safe user data for Redux state
    const affiliations = adaptAffiliations(response.data.affiliations)
    const user = adaptUser(response.data.user, affiliations)

    return {
      user,
      affiliations,
      message: response.data.message,
    }
  } catch (error) {
    console.error('Session refresh failed:', error)
    throw error
  }
}
