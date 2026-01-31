import type { ServerUser, ServerUserAffiliation } from '@/api/auth/types/user.types'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import type { User, UserSettings } from '@/domain/user/user.types'
import type { UserAffiliation } from '@/domain/user/user-affiliation.types'
import { formatRut } from '@/lib/rut'

export function adaptUser(serverUser: ServerUser, affiliations: Record<number, Affiliation>): User {
  const userSettings: UserSettings = {
    theme: serverUser.userSettings.userTheme as 'light' | 'dark',
    language: serverUser.userSettings.userLanguage,
    fontSize: serverUser.userSettings.userFontSize,
    timezone: serverUser.userSettings.userTimezone,
    emailNotifications: serverUser.userSettings.emailNotifications,
    onlyOneSessionAllowed: serverUser.userSettings.onlyOneSessionPerDevice,
    showProfilePic: serverUser.userSettings.showProfilePicture,
  }

  const userAffiliations: Record<number, UserAffiliation> = {}
  serverUser.userAffiliations.forEach((affiliation) => {
    userAffiliations[affiliation.affiliationId] = adaptUserAffiliation(
      affiliation,
      affiliations[affiliation.affiliationId]
    )
  })

  return {
    userRut: serverUser.userRut,
    firstName: serverUser.userFirstName,
    lastName: serverUser.userLastName,
    userSex: serverUser.userSex,
    birthday: formatDate(serverUser.userBirthDate),
    createdAt: formatDate(serverUser.userCreatedAt),
    updatedAt: serverUser.userUpdatedAt,
    userAffiliations: userAffiliations,
    userSettings: userSettings,
    userRutFormatted: formatRut(serverUser.userRut),
    userNameFormatted: `${formatName(serverUser.userFirstName)} ${formatName(serverUser.userLastName)}`,
    age: formatAge(serverUser.userBirthDate),
  }
}

function adaptUserAffiliation(
  serverUserAffiliation: ServerUserAffiliation,
  affiliation: Affiliation
): UserAffiliation {
  return {
    userAffiliationId: serverUserAffiliation.userAffiliationId,
    userRut: serverUserAffiliation.userRut,
    affiliationId: serverUserAffiliation.affiliationId,
    userAccessLevel: serverUserAffiliation.userAccessLevel,
    userEmail: serverUserAffiliation.userEmail,
    userPhone: serverUserAffiliation.userPhone,
    userPosition: serverUserAffiliation.userPosition,
    userAffiliationDate: serverUserAffiliation.affiliationDate,
    userIsActive: serverUserAffiliation.userIsActive,
    userLastLogin: serverUserAffiliation.userLastLogin,
    affiliationName: affiliation?.affiliationName ?? '',
    affiliationShortName: affiliation?.shortName ?? '',
    paidStatus: affiliation?.paidStatus ?? false,
  }
}

function formatName(name: string): string {
  return name.replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatAge(birthday: string): number {
  const today = new Date()
  const birthDate = new Date(birthday)
  const age = today.getFullYear() - birthDate.getFullYear()
  return age
}
