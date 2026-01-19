import type { AxiosInstance } from 'axios'
import type { HelpOverview } from './types/help.types'

const mockHelpOverview: HelpOverview = {
  hospitals: [
    { affiliationId: 1, name: 'Hospital de Curicó' },
    { affiliationId: 2, name: 'Hospital San Juan de Dios' },
    { affiliationId: 3, name: 'Clínica Santa María' },
  ],
  patientSubjects: [
    'Consulta sobre medicación',
    'Solicitud de cita médica',
    'Reporte de síntomas',
    'Efectos secundarios',
    'Solicitud de documentos',
    'Otra consulta',
  ],
  staffIssueTypes: [
    'Problemas de acceso',
    'Solicitud de permisos',
    'Actualización de datos',
    'Otra consulta',
  ],
  developerIssueTypes: [
    'Error o bug',
    'Sugerencia de funcionalidad',
    'Mejora de experiencia',
    'Problema de rendimiento',
    'Otro',
  ],
  developerPriorities: ['Baja', 'Media', 'Alta', 'Crítica'],
}

export const getHelpOverview = async (
  userRut: number | null,
  affiliationId: number | null,
  axiosClient: AxiosInstance
): Promise<HelpOverview> => {
  try {
    const response = await axiosClient.get('/api/v1/help/overview', {
      params: { userRut, affiliationId },
    })
    return response.data as HelpOverview
  } catch (error) {
    console.warn('⚠️ HELP API: Falling back to mock data', error)
    return mockHelpOverview
  }
}
