import type { AxiosInstance } from 'axios'
import { adaptPatientForTable } from './adapters/patient.adapter'
import type {
  PatientAffiliationAPIResponse,
  PatientDetail,
  PatientTableData,
} from './types/patient.types'

export const getPatientsByAffiliation = async (
  affiliationId: number | undefined,
  axiosClient: AxiosInstance
): Promise<PatientTableData[]> => {
  if (affiliationId === undefined) {
    console.warn('getPatientsByAffiliation called with undefined affiliationId.')
    return []
  }

  try {
    console.log('👥 Making patients request:', {
      affiliationId,
      url: `api/v1/patients/affiliation/${affiliationId}`,
      baseURL: axiosClient.defaults.baseURL,
      withCredentials: axiosClient.defaults.withCredentials,
    })

    const response = await axiosClient.get<PatientAffiliationAPIResponse[]>(
      `api/v1/patients/affiliation/${affiliationId}`
    )

    // Convert API response to table data
    const tableData = response.data.map(adaptPatientForTable)

    console.log('🔄 Converted to table data:', tableData)

    return tableData
  } catch (error: any) {
    console.error('Error fetching patients in API call:', error)
    throw error
  }
}

export const getPatientDetail = async (
  patientRut: number,
  axiosClient: AxiosInstance
): Promise<PatientDetail> => {
  if (!patientRut) {
    throw new Error('Invalid patient RUT')
  }

  const response = await axiosClient.get<PatientDetail>(`api/v1/patients/${patientRut}`)
  return response.data
}
