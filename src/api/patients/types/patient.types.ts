// API Response types matching the backend PatientAffiliation struct
export interface PatientAffiliationAPIResponse {
  patientAffiliationId: number
  patientRut: number
  userRut: number
  affiliationId: number
  affiliationDate: string
  affiliationStatus: AffiliationStatus
  isMainAffiliation: boolean
  // Patient details for table display
  firstName?: string
  lastName?: string
  birthday?: string
  clozapineIsActive?: boolean
}

export enum AffiliationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Retired = 3,
}

// For table display
export interface PatientTableData {
  patientRut: number
  name: string
  age: number
  state: string
  lastControl: string
  rawData: PatientAffiliationAPIResponse
}

export interface PatientDetail {
  patientRut: number
  firstName: string
  lastName: string
  sex: number
  birthday: string
  email: string
  phone: string
  address: string
  mainAffiliationId?: number
  mainAffiliationName?: string
  clozapineIsActive?: boolean
  diagnosis?: string
  lastControl?: string | null
  nextControl?: string | null
}
