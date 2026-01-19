/*
 * USER UTILITIES
 *
 * Helper functions for user-specific operations and data retrieval.
 */

/**
 * Gets the current user RUT from Redux session state
 * @returns {number | null} The user RUT or null if not found
 */
export function getCurrentUserRut(): number | null {
  try {
    const sessionData = localStorage.getItem('session')
    if (!sessionData) {
      return null
    }

    const sessionState = JSON.parse(sessionData)
    return sessionState?.userRut > 0 ? sessionState.userRut : null
  } catch (error) {
    console.error('Error getting user RUT from session:', error)
    return null
  }
}

/**
 * Checks if user is logged in according to Redux session state
 * @returns {boolean} True if user is logged in
 */
export function isUserLoggedIn(): boolean {
  try {
    const sessionData = localStorage.getItem('session')
    if (!sessionData) {
      return false
    }

    const sessionState = JSON.parse(sessionData)
    return sessionState?.isLoggedIn === true
  } catch (error) {
    console.error('Error checking login status:', error)
    return false
  }
}

/**
 * Gets the current user's selected affiliation ID from Redux session state
 * @returns {number | null} The selected affiliation ID or null if not found
 */
export function getCurrentUserAffiliationId(): number | null {
  try {
    const sessionData = localStorage.getItem('session')
    if (!sessionData) {
      return null
    }

    const sessionState = JSON.parse(sessionData)
    return sessionState?.selectedAffiliationId > 0 ? sessionState.selectedAffiliationId : null
  } catch (error) {
    console.error('Error getting affiliation ID from session:', error)
    return null
  }
}

/**
 * Gets the complete session state from Redux
 * @returns {any | null} The session state object or null if not found
 */
export function getSessionState(): any | null {
  try {
    const sessionData = localStorage.getItem('session')
    if (!sessionData) {
      return null
    }

    return JSON.parse(sessionData)
  } catch (error) {
    console.error('Error getting session state:', error)
    return null
  }
}
