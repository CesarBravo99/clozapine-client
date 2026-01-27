/*
 * AUTH UTILS INDEX
 *
 * Central export point for all authentication utility functions.
 * This provides clean imports throughout the application.
 */

// Re-export everything for convenience
export * from './cookie.utils'
// Cookie utilities
export { debugCORSHeaders, debugCookies, getCookieValue, testCORSFix } from './cookie.utils'
export * from './session.utils'
// Session utilities
export {
  hasAuthenticationCookies,
  hasValidSession,
  validateAuthenticationServer,
} from './session.utils'
export * from './user.utils'
// User utilities
export {
  getCurrentUserAffiliationId,
  getCurrentUserRut,
  getSessionState,
  isUserLoggedIn,
} from './user.utils'
