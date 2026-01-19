export type PersonnelStatus = 'active' | 'inactive' | 'pending'

export interface ConfigPersonnel {
  id: number
  name: string
  role: string
  rut: string
  email: string
  phone: string
  status: PersonnelStatus
}

export interface ConfigSecuritySettings {
  twoFactorRequired: boolean
  autoLockEnabled: boolean
  autoLockTimeoutMinutes: number
  loginAlertsEnabled: boolean
}

export interface ConfigPasswordPolicy {
  passwordExpiryDays: number | 'never'
  minimumLength: number
  requireUppercase: boolean
  requireNumbers: boolean
  requireSpecialCharacters: boolean
}

export interface ConfigAffiliationSettings {
  hospitalName: string
  contactEmail: string
  contactPhone: string
  address: string
  allowWeekendAppointments: boolean
}

export interface ConfigOverview {
  securitySettings: ConfigSecuritySettings
  passwordPolicy: ConfigPasswordPolicy
  personnel: ConfigPersonnel[]
  affiliationSettings: ConfigAffiliationSettings
}
