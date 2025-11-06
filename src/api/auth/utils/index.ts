/*
 * AUTH UTILS INDEX
 *
 * Central export point for all authentication utility functions.
 * This provides clean imports throughout the application.
 */

// Cookie utilities
export { getCookieValue, debugCookies, debugCORSHeaders, testCORSFix } from './cookie.utils';

// Session utilities
export {
	hasAuthenticationCookies,
	validateAuthenticationServer,
	hasValidSession,
} from './session.utils';

// User utilities
export {
	getCurrentUserRut,
	isUserLoggedIn,
	getCurrentUserAffiliationId,
	getSessionState,
} from './user.utils';

// Re-export everything for convenience
export * from './cookie.utils';
export * from './session.utils';
export * from './user.utils';
