export interface AffiliationPermissions {
  readonly affiliationId: number
  readonly permissionLevel: PermissionLevel
  readonly permissions: Permissions
  readonly createdAt: string
  readonly updatedAt: string
  readonly lastLogin: string
}

export enum PermissionLevel {
  Receptionist = 0,
  Nurse = 1,
  Doctor = 2,
  AffiliationAdmin = 3,
  SoftwareStaff = 4,
}

export type Permissions = {
  AdminAccess: boolean
  ManageLocations: boolean
  SeeReportsAndStatistics: boolean
  ManageAlgorithmLogic: boolean
  CreateUser: boolean
  EditUser: boolean
  DeleteUser: boolean
  SeeUserInfo: boolean
  CreatePatient: boolean
  EditPatient: boolean
  DeletePatient: boolean
  SeePatientInfo: boolean
  UpdatePatientInfo: boolean
  ManageAppointment: boolean
  SeeAppointments: boolean
}
