import type { UserAffiliation } from './user-affiliation.types'

export interface User {
  // Fields from server
  readonly userRut: number
  readonly firstName: string
  readonly lastName: string
  readonly userSex: UserSex
  readonly birthday: string
  readonly createdAt: string
  readonly updatedAt?: string
  readonly userAffiliations: Record<number, UserAffiliation>
  readonly userSettings: UserSettings

  // Frontend information
  readonly userRutFormatted: string
  readonly userNameFormatted: string
  readonly age: number
}

export enum UserSex {
  Male = 0,
  Female = 1,
  Other = 2,
}

export interface UserSettings {
  readonly theme: 'light' | 'dark'
  readonly language: string
  readonly fontSize: number
  readonly timezone: string
  readonly emailNotifications: boolean
  readonly onlyOneSessionAllowed: boolean
  readonly showProfilePic: boolean
}

export function getDefaultUser(): User {
  return {
    userRut: 0,
    firstName: '',
    lastName: '',
    userSex: UserSex.Other,
    birthday: '',
    createdAt: '',
    updatedAt: '',
    userAffiliations: {},
    userSettings: {
      theme: 'light',
      language: 'en',
      fontSize: 16,
      timezone: 'UTC',
      emailNotifications: true,
      onlyOneSessionAllowed: true,
      showProfilePic: true,
    },
    userRutFormatted: '',
    userNameFormatted: '',
    age: 0,
  }
}
