import type { AxiosInstance } from 'axios'
import { toast } from 'sonner'
import type {
  ExamErrorReportPayload,
  ExamRecordOverview,
  ExamRecordSubmission,
} from './types/examRecord.types'

const mockOverview: ExamRecordOverview = {
  patient: {
    fullName: 'Juan Carlos',
    lastName: 'González Pérez',
    rut: '12.345.678-9',
    age: 35,
    birthDate: '1988-05-15',
    ancestryQuestion: '¿Tiene algún antepasado de origen Africano, Arábico o del Mediterráneo?',
    ancestryAnswer: 'Sí',
  },
  documents: [
    {
      id: 'cbc',
      label: 'Examen Hemograma',
      description: 'Suba el último hemograma completo en formato PDF o imagen.',
      supportedTypes: ['pdf', 'jpg', 'png'],
    },
    {
      id: 'ecg',
      label: 'Electrocardiograma',
      description: 'Adjunte el ECG realizado dentro de los últimos 6 meses.',
      supportedTypes: ['pdf', 'jpg', 'png'],
    },
  ],
  symptoms: [
    { id: 'chest_pain', label: 'Dolor de pecho' },
    { id: 'tremors', label: 'Movimientos anormales' },
    { id: 'ideas', label: 'Ideas raras' },
    { id: 'suicidal', label: 'Pensamientos suicidas' },
    { id: 'breath', label: 'Falta de aire' },
    { id: 'constipation_short', label: 'Constipación < 3 días' },
    { id: 'constipation_long', label: 'Constipación > 3 días' },
    { id: 'palpitations', label: 'Palpitaciones' },
    { id: 'dizziness', label: 'Mareos' },
  ],
  lastUpdated: new Date().toISOString(),
}

export const getExamRecordOverview = async (
  userRut: number | null,
  axiosClient: AxiosInstance
): Promise<ExamRecordOverview> => {
  try {
    if (!userRut) {
      return mockOverview
    }
    const response = await axiosClient.get(`/api/v1/patients/${userRut}/exam-record`)
    return response.data as ExamRecordOverview
  } catch (error) {
    console.warn('⚠️ exam-record overview falling back to mock data', error)
    return mockOverview
  }
}

export const submitExamRecord = async (
  payload: ExamRecordSubmission,
  axiosClient: AxiosInstance
): Promise<{ success: boolean }> => {
  try {
    await axiosClient.post('/api/v1/patients/exam-record', payload)
    toast.success('Guardado correctamente')
    return { success: true }
  } catch (error) {
    console.error('Failed to submit exam record', error)
    toast.error('Error al guardar el registro')
    return { success: false }
  }
}

export const reportExamError = async (
  payload: ExamErrorReportPayload,
  axiosClient: AxiosInstance
): Promise<{ success: boolean }> => {
  try {
    await axiosClient.post('/api/v1/patients/exam-record/error', payload)
    return { success: true }
  } catch (error) {
    console.error('Failed to report exam error', error)
    return { success: true }
  }
}
