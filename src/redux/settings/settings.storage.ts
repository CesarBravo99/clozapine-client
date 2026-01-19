import {
  type SettingsState,
  getDefaultSettingsState,
  SETTINGS_STATE_STORAGE_KEY,
} from '@/redux/settings/settings.types'

const defaultSettings = getDefaultSettingsState()

export const loadSettingsState = () => {
  if (typeof window === 'undefined') {
    return defaultSettings
  }
  console.log('loading settings from localStorage')
  const serializedSettings = localStorage.getItem(SETTINGS_STATE_STORAGE_KEY)
  if (serializedSettings === null) {
    saveSettingsState(defaultSettings)
    return defaultSettings
  }
  return JSON.parse(serializedSettings)
}

export const saveSettingsState = (settings: SettingsState) => {
  if (typeof window === 'undefined') {
    return defaultSettings
  }
  try {
    localStorage.setItem(SETTINGS_STATE_STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Error saving settings to localStorage:', e)
  }
}
