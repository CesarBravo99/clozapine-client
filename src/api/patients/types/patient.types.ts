// API Response types matching the backend PatientAffiliation struct
export interface PatientAffiliationAPIResponse {
  affiliationStatus: number
  address: string
  ascendants: string
  birthday: string
  clozapineIsActive: boolean
  clozapineStartDate: string
  clozapineWasSuspended: boolean
  email: string
  notes: string
  patientFirstName: string
  patientLastName: string
  patientRut: number
  patientSex: string
  phone: string
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
