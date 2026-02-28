import type { PatientAffiliationAPIResponse, PatientTableData } from '../types/patient.types'

// Convert API response to table data
export const adaptPatientForTable = (
  apiResponse: PatientAffiliationAPIResponse
): PatientTableData => {
  // Only process if patient details are available
  if (!apiResponse.patientFirstName || !apiResponse.patientLastName || !apiResponse.birthday) {
    throw new Error('Patient details are missing in API response')
  }

  const age = calculateAge(apiResponse.birthday)
  const state = getStateText(
    apiResponse.clozapineIsActive || false,
    apiResponse?.affiliationStatus || 0
  )

  return {
    patientRut: apiResponse.patientRut,
    name: `${apiResponse.patientFirstName} ${apiResponse.patientLastName}`,
    age,
    state,
    lastControl: 'No registrado', // TODO: Add last control date when available
    rawData: apiResponse,
  }
}

// Helper functions
const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const getStateText = (clozapineIsActive: boolean, affiliationStatus: number): string => {
  if (affiliationStatus !== 1) {
    // Not approved
    return 'Afiliación Inactiva'
  }
  return clozapineIsActive ? 'Activo' : 'Inactivo'
}
