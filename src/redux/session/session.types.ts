/*
 * SECURE SESSION STATE - SECURITY PRINCIPLES:
 *
 * 1. NO SENSITIVE DATA: This store contains only UI/UX state, no authorization data
 * 2. SERVER AUTHORITY: All permissions/roles validated server-side via HTTP-only cookies
 * 3. SESSION MANAGEMENT: Tracks login status for UI purposes only
 * 4. AFFILIATION UX: Stores selected affiliation for navigation/display only
 *
 * WHAT'S STORED HERE (Safe):
 * - isLoggedIn: UI state for showing/hiding login forms
 * - selectedAffiliationId: Current affiliation context for navigation
 * - userRut: Display purposes only (already public in user profile)
 *
 * WHAT'S NOT STORED (Secure):
 * - userRole: Real role stored in HTTP-only cookies, validated server-side
 * - userPermissions: Never stored client-side, always fetched from server
 * - Sensitive authentication tokens: Handled by HTTP-only cookies
 */

export const SESSION_STATE_STORAGE_KEY = 'session'

export interface SessionState {
  isLoggedIn: boolean
  selectedAffiliationId: number
  userRut: number // For display purposes only - not for authorization
}

export function getDefaultSessionState(): SessionState {
  return {
    isLoggedIn: false,
    selectedAffiliationId: -1,
    userRut: -1,
  }
}
