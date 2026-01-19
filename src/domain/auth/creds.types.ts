import type { AffiliationPermissions } from '@/domain/auth/permissions.types'

export interface Credentials {
  userRut: number
  userRole: UserRole
  userPermissions: Record<number, AffiliationPermissions>
  createdAt: string
  updatedAt: string
  lastLogin: string
}

export function getDefaultCredentials(): Credentials {
  const now = new Date().toISOString()
  return {
    userRut: -1,
    userRole: UserRole.NotLoggedIn,
    userPermissions: {},
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
  }
}

export enum UserRole {
  NotLoggedIn = -1,
  AffiliationUser = 0,
  AffiliationAdmin = 1,
  SoftwareStaff = 2,
  SoftwareAdmin = 3,
}

// Helper functions to convert between Date and ISO string
export function toDate(isoString: string): Date {
  return new Date(isoString)
}

export function toISOString(date: Date): string {
  return date.toISOString()
}
