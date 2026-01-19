import type { AxiosInstance } from 'axios'
import type {
  PatientAffiliationAPIResponse,
  PatientDetail,
  PatientTableData,
} from './types/patient.types'
import { adaptPatientForTable } from './adapters/patient.adapter'

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

    console.log('✅ PATIENTS response success:', response)

    // Convert API response to table data
    const tableData = response.data.map(adaptPatientForTable)

    console.log('🔄 Converted to table data:', tableData)

    return tableData
  } catch (error: any) {
    console.error('❌ Error fetching patients in API call:', error)

    // Enhanced error logging for CORS issues
    if (error.message === 'Network Error') {
      console.error('🚫 CORS Error Details:', {
        message: 'Network Error typically indicates CORS blocking',
        possibleCauses: [
          'CORS Access-Control-Allow-Origin header mismatch',
          'Server not setting proper CORS headers',
          'Browser blocking due to credentials + wildcard origin',
        ],
        troubleshooting: [
          'Check server CORS configuration',
          'Verify server is running on port 1090',
          'Clear browser cache and cookies',
          'Check browser developer tools Network tab',
        ],
      })
    }

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
