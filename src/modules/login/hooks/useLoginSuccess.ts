import { useRouter } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import type { LoginFormResponse } from '@/api/auth/user.login'
import { sessionLogin } from '@/redux/session/session.slice'
import { setSettings } from '@/redux/settings/settings.slice'
import type { FontSizeState, LanguageState, ThemeState } from '@/redux/settings/settings.types'
import { setUserState } from '@/redux/user/user.slice'

export const useLoginSuccess = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleLoginSuccess = async (response: LoginFormResponse) => {
    console.log('handleLoginSuccess Login successful!')

    // Set user settings (safe UI state)
    dispatch(
      setSettings({
        theme: response.user.userSettings.theme as ThemeState,
        lang: response.user.userSettings.language as LanguageState,
        fontSize: response.user.userSettings.fontSize as FontSizeState,
        showProfilePic: response.user.userSettings.showProfilePic,
      })
    )

    // Set user profile data (safe display data)
    dispatch(
      setUserState({
        user: response.user,
        affiliations: response.affiliations,
      })
    )

    // Determine initial affiliation selection
    const userAffiliationKeys = Object.keys(response.user.userAffiliations)

    // Select first affiliation by default
    const selectedAffiliationId = Number.parseInt(userAffiliationKeys[0], 10)

    // Set secure session state (no sensitive credentials)
    dispatch(
      sessionLogin({
        userRut: response.user.userRut, // Safe for display
        selectedAffiliationId,
      })
    )

    // Navigate to main app
    console.log('handleLoginSuccess Navigating to notifications')
    router.navigate({ to: '/notifications' })
  }

  return handleLoginSuccess
}
