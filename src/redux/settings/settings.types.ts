export const SETTINGS_STATE_STORAGE_KEY = 'settings'

export enum ThemeState {
  Light = 'light',
  Dark = 'dark',
}
export enum LanguageState {
  EN = 'en',
  ES = 'es',
}
export enum FontSizeState {
  Small = 12,
  Medium = 16,
  Large = 20,
}
export interface SettingsState {
  theme: ThemeState
  lang: LanguageState
  fontSize: FontSizeState
  showProfilePic: boolean
}

export function getDefaultSettingsState(): SettingsState {
  return {
    theme: ThemeState.Light,
    lang: LanguageState.ES,
    fontSize: FontSizeState.Medium,
    showProfilePic: true,
  }
}
