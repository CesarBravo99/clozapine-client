import type {
  UserProfileData,
  ProfileDisplayData,
  PersonalInfo,
  SettingsDisplayData,
  CredentialsDisplayData,
  AffiliationDisplayData,
} from '../types/profile.types'
import { UserRole, UserSex } from '../types/profile.types'

/**
 * Maps UserSex enum to string representation
 */
export const mapUserSexToString = (sex: UserSex): string => {
  switch (sex) {
    case UserSex.Male:
      return 'Masculino'
    case UserSex.Female:
      return 'Femenino'
    default:
      return 'No especificado'
  }
}

/**
 * Maps UserRole enum to string representation
 */
export const mapUserRoleToString = (role: UserRole): string => {
  switch (role) {
    case UserRole.AffiliationUser:
      return 'Usuario'
    case UserRole.AffiliationAdmin:
      return 'Administrador'
    case UserRole.SoftwareStaff:
      return 'Staff del Sistema'
    case UserRole.VE:
      return 'VE Solutions'
    default:
      return 'Desconocido'
  }
}

/**
 * Maps permission level to string representation
 */
export const mapPermissionLevelToString = (level: number): string => {
  switch (level) {
    case 0:
      return 'Lectura'
    case 1:
      return 'Escritura'
    case 2:
      return 'Administrador'
    case 3:
      return 'Super Admin'
    default:
      return 'Sin permisos'
  }
}

/**
 * Calculates age from birth date string
 */
export const calculateAge = (birthDateString: string): number => {
  if (!birthDateString) return 0

  try {
    const birthDate = new Date(birthDateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  } catch (error) {
    console.warn('Error calculating age:', error)
    return 0
  }
}

/**
 * Formats date string to locale string (DD/MM/YYYY)
 */
export const formatProfileDate = (dateString: string): string => {
  if (!dateString) return 'No disponible'

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch (error) {
    console.warn('Error formatting date:', error)
    return dateString
  }
}

/**
 * Formats date and time string for last login display
 */
export const formatLastLoginDate = (dateString: string): string => {
  if (!dateString) return 'Nunca'

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    console.warn('Error formatting last login date:', error)
    return dateString
  }
}

/**
 * Formats user RUT with proper formatting
 */
export const formatUserRut = (rut: number): string => {
  if (!rut || rut <= 0) return 'Sin RUT'

  const rutString = rut.toString()
  if (rutString.length < 7) return rutString

  // Format as XX.XXX.XXX-X
  const body = rutString.slice(0, -1)
  const verifier = rutString.slice(-1)

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formattedBody}-${verifier}`
}

/**
 * Maps font size number to display string
 */
export const mapFontSizeToString = (fontSize: number): string => {
  switch (fontSize) {
    case 12:
      return 'Pequeño'
    case 14:
      return 'Normal'
    case 16:
      return 'Grande'
    case 18:
      return 'Extra Grande'
    default:
      return `${fontSize}px`
  }
}

/**
 * Formats theme name for display
 */
export const formatThemeName = (theme: string): string => {
  switch (theme.toLowerCase()) {
    case 'light':
      return 'Claro'
    case 'dark':
      return 'Oscuro'
    case 'auto':
      return 'Automático'
    default:
      return theme
  }
}

/**
 * Formats language code for display
 */
export const formatLanguageName = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'es':
      return 'Español'
    case 'en':
      return 'English'
    default:
      return language
  }
}

/**
 * Adapts PersonalInfo from UserProfileData
 */
export const adaptPersonalInfo = (data: UserProfileData): PersonalInfo => {
  const { user } = data

  return {
    name: `${user.userFirstName} ${user.userLastName}`.trim(),
    rut: formatUserRut(user.userRut),
    sex: mapUserSexToString(user.userSex),
    birthDate: formatProfileDate(user.userBirthDate),
    age: calculateAge(user.userBirthDate),
    createdAt: formatProfileDate(user.userCreatedAt),
    updatedAt: formatProfileDate(user.userUpdatedAt),
  }
}

/**
 * Adapts SettingsDisplayData from UserProfileData
 */
export const adaptSettingsDisplayData = (data: UserProfileData): SettingsDisplayData => {
  const { settings } = data

  return {
    theme: formatThemeName(settings.userTheme),
    language: formatLanguageName(settings.userLanguage),
    fontSize: mapFontSizeToString(settings.userFontSize),
    timezone: settings.userTimezone || 'No configurado',
    notifications: {
      email: settings.emailNotifications,
      whatsapp: settings.whatsappNotifications,
    },
    security: {
      onlyOneSession: settings.onlyOneSessionPerDevice,
      showProfilePicture: settings.showProfilePicture,
    },
  }
}

/**
 * Adapts CredentialsDisplayData from UserProfileData
 */
export const adaptCredentialsDisplayData = (data: UserProfileData): CredentialsDisplayData => {
  const { credentials } = data

  return {
    role: mapUserRoleToString(credentials.userRole),
    createdAt: formatProfileDate(credentials.createdAt),
    updatedAt: formatProfileDate(credentials.updatedAt),
    lastLogin: formatLastLoginDate(credentials.lastLogin),
    passwordChanged: credentials.passwordChanged,
  }
}

/**
 * Adapts AffiliationDisplayData array from UserProfileData
 */
export const adaptAffiliationsDisplayData = (data: UserProfileData): AffiliationDisplayData[] => {
  return data.affiliations.map((affiliation) => ({
    id: affiliation.affiliationId,
    email: affiliation.userEmail || 'Sin email',
    phone: affiliation.userPhone || 'Sin teléfono',
    position: affiliation.userPosition || 'Sin cargo',
    isActive: affiliation.userIsActive,
    affiliationDate: formatProfileDate(affiliation.affiliationDate),
    lastLogin: formatLastLoginDate(affiliation.lastLogin),
    permissionLevel: mapPermissionLevelToString(affiliation.permissionLevel),
  }))
}

/**
 * Main adapter function that transforms UserProfileData to ProfileDisplayData
 */
export const adaptUserProfileToDisplayData = (data: UserProfileData): ProfileDisplayData => {
  if (!data) {
    throw new Error('Profile data is required')
  }

  try {
    return {
      personalInfo: adaptPersonalInfo(data),
      settings: adaptSettingsDisplayData(data),
      credentials: adaptCredentialsDisplayData(data),
      affiliations: adaptAffiliationsDisplayData(data),
    }
  } catch (error) {
    console.error('Error adapting profile data:', error)
    throw new Error('Failed to process profile data')
  }
}
