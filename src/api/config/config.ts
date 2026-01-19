import type { AxiosInstance } from 'axios'
import type {
  ConfigOverview,
  ConfigPersonnel,
  ConfigSecuritySettings,
  ConfigPasswordPolicy,
  ConfigAffiliationSettings,
  PersonnelStatus,
} from './types/config.types'

const MOCK_PERSONNEL: ConfigPersonnel[] = [
  {
    id: 1,
    name: 'Dra. Daniela Ramos',
    role: 'Médico',
    rut: '12.345.678-9',
    email: 'daniela.ramos@example.com',
    phone: '+56 9 1234 5678',
    status: 'active',
  },
  {
    id: 2,
    name: 'Dr. Carlos Mendoza',
    role: 'Médico',
    rut: '9.876.543-2',
    email: 'carlos.mendoza@example.com',
    phone: '+56 9 9876 5432',
    status: 'active',
  },
  {
    id: 3,
    name: 'Jorge Fuentes',
    role: 'Administrador',
    rut: '15.432.987-6',
    email: 'jorge.fuentes@example.com',
    phone: '+56 9 1543 2987',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Ana López',
    role: 'Enfermera',
    rut: '11.222.333-4',
    email: 'ana.lopez@example.com',
    phone: '+56 9 1122 3344',
    status: 'pending',
  },
]

const buildMockSecuritySettings = (): ConfigSecuritySettings => ({
  twoFactorRequired: true,
  autoLockEnabled: true,
  autoLockTimeoutMinutes: 15,
  loginAlertsEnabled: false,
})

const buildMockPasswordPolicy = (): ConfigPasswordPolicy => ({
  passwordExpiryDays: 90,
  minimumLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialCharacters: false,
})

const buildMockAffiliationSettings = (): ConfigAffiliationSettings => ({
  hospitalName: 'Hospital de Curicó',
  contactEmail: 'contacto@hospitalcurico.cl',
  contactPhone: '+56 75 123 4567',
  address: 'Av. San Martín 1234, Curicó',
  allowWeekendAppointments: false,
})

const buildMockOverview = (): ConfigOverview => ({
  securitySettings: buildMockSecuritySettings(),
  passwordPolicy: buildMockPasswordPolicy(),
  personnel: MOCK_PERSONNEL,
  affiliationSettings: buildMockAffiliationSettings(),
})

export const getConfigOverview = async (
  userRut: number,
  affiliationId: number,
  axiosClient: AxiosInstance
): Promise<ConfigOverview> => {
  try {
    const response = await axiosClient.get(`/api/v1/affiliations/${affiliationId}/config`, {
      params: { userRut },
    })
    return response.data as ConfigOverview
  } catch (error) {
    console.warn('⚠️ CONFIG API: Falling back to mock configuration data', error)
    return buildMockOverview()
  }
}

export const saveSecuritySettings = async (
  affiliationId: number,
  settings: ConfigSecuritySettings,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.put(`/api/v1/affiliations/${affiliationId}/security-settings`, settings)
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to persist security settings', error)
  }
}

export const savePasswordPolicy = async (
  affiliationId: number,
  policy: ConfigPasswordPolicy,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.put(`/api/v1/affiliations/${affiliationId}/password-policy`, policy)
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to persist password policy', error)
  }
}

export const saveAffiliationSettings = async (
  affiliationId: number,
  settings: ConfigAffiliationSettings,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.put(`/api/v1/affiliations/${affiliationId}/contact-settings`, settings)
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to persist affiliation settings', error)
  }
}

export const addPersonnel = async (
  affiliationId: number,
  personnel: Omit<ConfigPersonnel, 'id'>,
  axiosClient: AxiosInstance
) => {
  try {
    const response = await axiosClient.post(
      `/api/v1/affiliations/${affiliationId}/personnel`,
      personnel
    )
    return response.data as ConfigPersonnel
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to add personnel, returning mock entry', error)
    return {
      ...personnel,
      id: Date.now(),
    }
  }
}

export const updatePersonnel = async (
  affiliationId: number,
  personnel: ConfigPersonnel,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.put(
      `/api/v1/affiliations/${affiliationId}/personnel/${personnel.id}`,
      personnel
    )
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to update personnel', error)
  }
}

export const deletePersonnel = async (
  affiliationId: number,
  personnelId: number,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.delete(`/api/v1/affiliations/${affiliationId}/personnel/${personnelId}`)
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to delete personnel', error)
  }
}

export const resetPersonnelPassword = async (
  affiliationId: number,
  personnelId: number,
  axiosClient: AxiosInstance
) => {
  try {
    await axiosClient.post(
      `/api/v1/affiliations/${affiliationId}/personnel/${personnelId}/reset-password`
    )
  } catch (error) {
    console.warn('⚠️ CONFIG API: Failed to reset personnel password', error)
  }
}
