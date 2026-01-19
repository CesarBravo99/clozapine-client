// User data types
export interface User {
  userRut: number
  userFirstName: string
  userLastName: string
  userSex: UserSex
  userBirthDate: string // ISO date string
  userCreatedAt: string // ISO date string
  userUpdatedAt: string // ISO date string
  userAffiliations?: UserAffiliation[] // Optional as it may be separate
  userSettings?: UserSettings // Optional as it may be separate
}

export enum UserSex {
  Male = 1,
  Female = 2,
}

// User settings types
export interface UserSettings {
  userSettingsId: number
  userRut: number
  userTheme: string
  userLanguage: string
  userFontSize: number
  userTimezone: string
  emailNotifications: boolean
  whatsappNotifications: boolean
  onlyOneSessionPerDevice: boolean
  showProfilePicture: boolean
}

// User credentials types (without sensitive data)
export interface UserCredentials {
  userRut: number
  userRole: UserRole
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  lastLogin: string // ISO date string
  passwordChanged: boolean
}

export enum UserRole {
  AffiliationUser = 0,
  AffiliationAdmin = 1,
  SoftwareStaff = 2,
  VE = 3,
}

// User affiliation types
export interface UserAffiliation {
  userRut: number
  affiliationId: number
  permissionLevel: number
  userEmail: string
  userPhone: string
  userPosition: string
  userIsActive: boolean
  affiliationDate: string // ISO date string
  lastLogin: string // ISO date string
}

// Complete profile data - matches backend UserProfileData
export interface UserProfileData {
  user: User
  settings: UserSettings
  credentials: UserCredentials
  affiliations: UserAffiliation[]
}

// Update request types - matches backend UpdateUserProfileRequest
export interface UpdateUserProfileRequest {
  userFirstName?: string
  userLastName?: string
  userSex?: UserSex
  userBirthDate?: string // ISO date string
}

// Settings update request - matches backend UserSettings
export interface UpdateUserSettingsRequest {
  userSettingsId?: number
  userRut?: number
  userTheme?: string
  userLanguage?: string
  userFontSize?: number
  userTimezone?: string
  emailNotifications?: boolean
  whatsappNotifications?: boolean
  onlyOneSessionPerDevice?: boolean
  showProfilePicture?: boolean
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Display types for components
export interface ProfileDisplayData {
  personalInfo: PersonalInfo
  settings: SettingsDisplayData
  credentials: CredentialsDisplayData
  affiliations: AffiliationDisplayData[]
}

export interface PersonalInfo {
  name: string
  rut: string
  sex: string
  birthDate: string
  age: number
  createdAt: string
  updatedAt: string
}

export interface SettingsDisplayData {
  theme: string
  language: string
  fontSize: string
  timezone: string
  notifications: {
    email: boolean
    whatsapp: boolean
  }
  security: {
    onlyOneSession: boolean
    showProfilePicture: boolean
  }
}

export interface CredentialsDisplayData {
  role: string
  createdAt: string
  updatedAt: string
  lastLogin: string
  passwordChanged: boolean
}

export interface AffiliationDisplayData {
  id: number
  email: string
  phone: string
  position: string
  isActive: boolean
  affiliationDate: string
  lastLogin: string
  permissionLevel: string
}
