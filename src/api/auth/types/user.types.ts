export type ServerUser = {
  userRut: number
  userFirstName: string
  userLastName: string
  userSex: number
  userBirthDate: string
  userCareerTitle: string
  userCreatedAt: string
  userUpdatedAt: string
  userAffiliations: ServerUserAffiliation[]
  userSettings: ServerUserSettings
}

export type ServerUserAffiliation = {
  userAffiliationId: number
  userRut: number
  affiliationId: number
  userAccessLevel: number
  userEmail: string
  userPhone: string
  userPosition: string
  affiliationDate: string
  userIsActive: boolean
  userLastLogin: string
}

export type ServerUserSettings = {
  userSettingsId: number
  userRut: number
  userTheme: string
  userLanguage: string
  userFontSize: number
  userTimezone: string
  emailNotifications: boolean
  whatsappNotifications: boolean
  onlyOneSessionPerDevice: boolean
  showProfilePicture: boolean
}
