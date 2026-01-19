export interface UserAffiliation {
  // Server fields
  readonly userAffiliationId: number
  readonly userRut: number
  readonly affiliationId: number
  readonly userAccessLevel: UserAccessLevel
  readonly userEmail: string
  readonly userPhone: string
  readonly userPosition: string
  readonly userAffiliationDate: string
  readonly userIsActive: boolean
  readonly userLastLogin: string

  // Front fields
  readonly affiliationName: string
  readonly affiliationShortName: string
  readonly paidStatus: boolean
}

export enum UserAccessLevel {
  SoftwareAdmin = 0,
  AffiliationAdmin = 1,
  Doctor = 2,
  Nurse = 3,
  Administrative = 4,
}
