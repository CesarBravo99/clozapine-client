import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loadSettingsState, saveSettingsState } from '@/redux/settings/settings.storage'
import {
  ThemeState,
  LanguageState,
  FontSizeState,
  type SettingsState,
} from '@/redux/settings/settings.types'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettingsState() as SettingsState,
  reducers: {
    toggleTheme: (state: SettingsState) => {
      document.documentElement.classList.toggle('dark', state.theme === ThemeState.Light)
      state.theme = state.theme === ThemeState.Light ? ThemeState.Dark : ThemeState.Light
      saveSettingsState(state)
      return state
    },
    setSettings: (state: SettingsState, action: PayloadAction<SettingsState>) => {
      document.documentElement.classList.toggle('dark', action.payload.theme === ThemeState.Dark)
      state = { ...state, ...action.payload }
      saveSettingsState(state)
      return state
    },
    setTheme: (state: SettingsState, action: PayloadAction<ThemeState>) => {
      document.documentElement.classList.toggle('dark', action.payload === ThemeState.Dark)
      state.theme = action.payload
      saveSettingsState(state)
      return state
    },
    setLang: (state: SettingsState, action: PayloadAction<LanguageState>) => {
      state.lang = action.payload
      saveSettingsState(state)
      return state
    },
    setFontSize: (state: SettingsState, action: PayloadAction<FontSizeState>) => {
      state.fontSize = action.payload
      saveSettingsState(state)
      return state
    },
    setShowProfilePic: (state: SettingsState, action: PayloadAction<boolean>) => {
      state.showProfilePic = action.payload
      saveSettingsState(state)
      return state
    },
  },
  selectors: {
    selectSettings: (state: SettingsState) => state,
    selectTheme: (state: SettingsState) => state.theme,
    selectLang: (state: SettingsState) => state.lang,
    selectFontSize: (state: SettingsState) => state.fontSize,
    selectShowProfilePic: (state: SettingsState) => state.showProfilePic,
  },
})

export const { toggleTheme, setSettings, setTheme, setLang, setFontSize, setShowProfilePic } =
  settingsSlice.actions
export const { selectTheme, selectLang, selectFontSize, selectShowProfilePic, selectSettings } =
  settingsSlice.selectors
export default settingsSlice.reducer
