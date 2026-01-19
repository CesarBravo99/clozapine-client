// Export API functions
export {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  changePassword,
  updateUserPreferences,
  updateUserSecurity,
} from './profile'

// Export types
export type {
  User,
  UserSettings,
  UserCredentials,
  UserAffiliation,
  UserProfileData,
  UpdateUserProfileRequest,
  UpdateUserSettingsRequest,
  ChangePasswordRequest,
  ProfileDisplayData,
  PersonalInfo,
  SettingsDisplayData,
  CredentialsDisplayData,
  AffiliationDisplayData,
} from './types/profile.types'
export { UserSex, UserRole } from './types/profile.types'

// Export adapter functions
export {
  mapUserSexToString,
  mapUserRoleToString,
  mapPermissionLevelToString,
  calculateAge,
  formatProfileDate,
  formatLastLoginDate,
  formatUserRut,
  mapFontSizeToString,
  formatThemeName,
  formatLanguageName,
  adaptPersonalInfo,
  adaptSettingsDisplayData,
  adaptCredentialsDisplayData,
  adaptAffiliationsDisplayData,
  adaptUserProfileToDisplayData,
} from './adapters/profile.adapter'
