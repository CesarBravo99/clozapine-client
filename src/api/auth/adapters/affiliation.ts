import type { ServerAffiliation } from '@/api/auth/types/affiliation.types'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import type { AffiliationSettings } from '@/domain/affiliation/affiliation-settings.types'

export function adaptAffiliations(serverAffiliations: ServerAffiliation[]): Affiliation[] {
  const affiliationData: Affiliation[] = []

  serverAffiliations.forEach((affiliation: ServerAffiliation) => {
    affiliationData.push(adaptAffiliation(affiliation))
  })

  return affiliationData
}

function adaptAffiliation(affiliation: ServerAffiliation): Affiliation {
  const affiliationSettings: AffiliationSettings = {
    affiliationId: affiliation.affiliationId,
    workDaySettings: {
      workDayStart: affiliation.affiliationSettings.workDaySettings.workDayStart,
      workDayEnd: affiliation.affiliationSettings.workDaySettings.workDayEnd,
    },
    appointmentSettings: {
      appointmentDuration: affiliation.affiliationSettings.appointmentSettings.appointmentDuration,
      allowWeekendAppointments:
        affiliation.affiliationSettings.appointmentSettings.allowWeekendAppointments,
    },
    passwordRequirements: {
      minLength: affiliation.affiliationSettings.passwordRequirements.minLength,
      specialCharacters: affiliation.affiliationSettings.passwordRequirements.specialCharacters,
      requireNumbers: affiliation.affiliationSettings.passwordRequirements.requireNumbers,
      requireUppercase: affiliation.affiliationSettings.passwordRequirements.requireUppercase,
      expirationEnabled: affiliation.affiliationSettings.passwordRequirements.expirationEnabled,
      expirationDays: affiliation.affiliationSettings.passwordRequirements.expirationDays,
    },
    showAffiliationLogo: affiliation.affiliationSettings.showAffiliationLogo,
    showUserLogs: affiliation.affiliationSettings.showUserLogs,
  }

  return {
    affiliationId: affiliation.affiliationId,
    affiliationName: affiliation.affiliationName,
    shortName: affiliation.affiliationShortName,
    supportPhone: affiliation.supportPhone,
    supportEmail: affiliation.supportEmail,
    affiliationSettings: affiliationSettings,
    paidStatus: affiliation.paidStatus,
  }
}
