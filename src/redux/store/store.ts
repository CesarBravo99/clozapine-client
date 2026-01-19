import { configureStore, combineReducers } from '@reduxjs/toolkit'
import settingsReducer from '@/redux/settings/settings.slice'
import sessionReducer from '@/redux/session/session.slice'
import userReducer from '@/redux/user/user.slice'
import { saveToLocalStorage } from '@/redux/store/store.storage'

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: number
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

const rootReducer = combineReducers({
  settings: settingsReducer,
  session: sessionReducer,
  user: userReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  // Enable Redux DevTools in development, but exclude sensitive data
  devTools: import.meta.env.DEV && {
    // Sanitize state to prevent sensitive data exposure in DevTools
    stateSanitizer: (state) => {
      // Session state is already safe (no sensitive credentials)
      return state
    },
  },
})

// Debounced save function to avoid excessive localStorage writes
const debouncedSave = debounce((stateToSave: { settings: any; session: any }) => {
  saveToLocalStorage({
    settings: stateToSave.settings,
    session: stateToSave.session,
  })
}, 100) // Increased debounce time to 100ms for better performance

// Subscribe to store changes and save relevant state to localStorage
store.subscribe(() => {
  if (typeof window !== 'undefined') {
    const state = store.getState()
    const stateToSave = {
      settings: state.settings,
      session: state.session,
    }
    debouncedSave(stateToSave)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
