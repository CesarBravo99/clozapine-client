import { type User, getDefaultUser } from '@/domain/user/user.types'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'

export const USER_STATE_STORAGE_KEY = 'userState'

export interface UserState {
  user: User
  affiliations: Record<number, Affiliation>
}

export function getDefaultUserState(): UserState {
  return {
    user: getDefaultUser(),
    affiliations: {},
  }
}
