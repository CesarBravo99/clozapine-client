import type { Store } from '@reduxjs/toolkit'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AxiosInstance } from 'axios'
import { Provider as ReduxProvider } from 'react-redux'
import { debugCookies, hasAuthenticationCookies } from '@/api/auth/utils'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { Toaster } from '@/components/ui/sonner'
import type { useAuthenticatedNavigate } from '@/hooks/useNavigate'
import { sessionLogin, sessionLogout } from '@/redux/session/session.slice'
import { refreshSession } from '@/redux/session/session.thunk'
import { SESSION_STATE_STORAGE_KEY } from '@/redux/session/session.types'
import { setSettings } from '@/redux/settings/settings.slice'
import { type RootState, store } from '@/redux/store/store'
import { loadFromLocalStorage } from '@/redux/store/store.storage'
import { setUserState } from '@/redux/user/user.slice'

export interface RouterContext {
  navigate: typeof useAuthenticatedNavigate
  store: Store<RootState, any, any>
  axiosClient: AxiosInstance
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    console.log('🚀 ROOT beforeLoad: Starting at path:', location.pathname)

    // Debug cookies for troubleshooting
    debugCookies()

    // If user data is already in memory, we're in an active in-app session
    // (e.g., just logged in). The user slice is NOT persisted to localStorage, so
    // userRut > 0 only when setUserState was dispatched — never on a cold page refresh.
    const inMemoryState = context.store.getState()
    if (inMemoryState.session?.isLoggedIn && (inMemoryState.user?.user?.userRut ?? 0) > 0) {
      console.log('ROOT beforeLoad: Active in-memory session, skipping restoration')
      return
    }

    try {
      // 1. Load persisted state from localStorage
      const persistedState = loadFromLocalStorage()
      console.log('📱 ROOT beforeLoad: Persisted state loaded:', persistedState)

      if (persistedState) {
        // 2. Always restore settings if available (independent of session)
        if (persistedState.settings) {
          console.log('⚙️ ROOT beforeLoad: Restoring settings:', persistedState.settings)
          context.store.dispatch(setSettings(persistedState.settings))
        }

        // 3. Check if we have a valid session to restore
        const sessionState = persistedState.session
        if (sessionState?.isLoggedIn && sessionState?.userRut > 0) {
          console.log('🔄 ROOT beforeLoad: Session found for user:', sessionState.userRut)

          // 4. Check if we have authentication cookies before attempting refresh
          if (hasAuthenticationCookies()) {
            console.log('🍪 ROOT beforeLoad: Auth cookies found, attempting session refresh')

            try {
              // 5. Validate session and restore user data from server
              const refreshResult = await context.store.dispatch(refreshSession())

              if (refreshSession.fulfilled.match(refreshResult)) {
                // 6. Session is valid - restore all user state
                const { user, affiliations } = refreshResult.payload

                // Restore user data
                context.store.dispatch(
                  setUserState({
                    user,
                    affiliations,
                  })
                )

                // Restore session state with current affiliation
                const currentAffiliationId = sessionState.selectedAffiliationId || -1
                context.store.dispatch(
                  sessionLogin({
                    userRut: user.userRut,
                    selectedAffiliationId: currentAffiliationId,
                  })
                )

                console.log(
                  '✅ ROOT beforeLoad: Session restored successfully for user:',
                  user.userRut
                )
              } else {
                // 7. Session is invalid - clear persisted state
                console.error('ROOT beforeLoad: Session refresh failed, clearing session')
                localStorage.removeItem(SESSION_STATE_STORAGE_KEY)
                context.store.dispatch(sessionLogout())
              }
            } catch (refreshError) {
              console.error('ROOT beforeLoad: Session refresh error:', refreshError)
              // Clear invalid session data
              localStorage.removeItem(SESSION_STATE_STORAGE_KEY)
              context.store.dispatch(sessionLogout())
            }
          } else {
            console.error('ROOT beforeLoad: No auth cookies found, clearing stale session')
            // Clear stale session data if no cookies present
            localStorage.removeItem(SESSION_STATE_STORAGE_KEY)
            context.store.dispatch(sessionLogout())
          }
        } else {
          console.error('ROOT beforeLoad: No valid session found, user needs to login')
        }
      } else {
        console.error('ROOT beforeLoad: No persisted state found, fresh start')
      }
    } catch (error) {
      console.error('❌ ROOT beforeLoad: Error during state restoration:', error)
      // Only clear session on error, keep settings
      localStorage.removeItem(SESSION_STATE_STORAGE_KEY)
      context.store.dispatch(sessionLogout())
    }

    console.log('✅ ROOT beforeLoad: Completed successfully')
  },
  component: () => (
    <>
      <head>
        <HeadContent />
      </head>
      <ReduxProvider store={store}>
        {/* <TSHeader /> */}
        <div className="min-h-screen flex flex-col" tabIndex={-1}>
          <Header />
          <main className="grow bg-linear-to-b from-gray-50 to-gray-50 dark:from-gray-950 dark:to-gray-950">
            <Outlet />
          </main>
          <Footer />
        </div>

        <Toaster />
        <TanStackRouterDevtools />
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </ReduxProvider>
    </>
  ),
})
