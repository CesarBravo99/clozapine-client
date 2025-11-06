/*
 * SESSION UTILITIES
 *
 * Helper functions for session validation and authentication checking.
 */

import { getCookieValue } from './cookie.utils';

/**
 * Checks if the user has authentication indicators
 * Note: HTTP-only cookies (user_rut, user_role) cannot be read by JavaScript
 * This function checks for the API token cookie and Redux session state in localStorage
 * @returns {boolean} True if authentication indicators are present
 */
export function hasAuthenticationCookies(): boolean {
	if (typeof document === 'undefined') {
		console.log(
			'🚫 No authentication cookies found in server-side rendering or Node.js environment'
		);
		return false;
	}

	// Check for API token cookie (non-HTTP-only, accessible to JavaScript)
	const hasApiToken = getCookieValue('token') !== null;

	// Check Redux session state in localStorage (using the actual key from Redux)
	let hasValidSessionState = false;
	try {
		const sessionData = localStorage.getItem('session'); // Redux session storage key
		if (sessionData) {
			const sessionState = JSON.parse(sessionData);
			hasValidSessionState = sessionState?.isLoggedIn === true && sessionState?.userRut > 0;
		}
	} catch (error) {
		console.error('Error checking Redux session state:', error);
	}

	console.log('🍪 Authentication check results:', {
		hasApiToken,
		hasValidSessionState,
		note: 'HTTP-only cookies (user_rut, user_role) cannot be detected by JavaScript',
	});

	// User is considered authenticated if they have both token and session state
	return hasApiToken && hasValidSessionState;
}

/**
 * Validates authentication by making a server request
 * This is the most reliable way to check auth since it validates HTTP-only cookies server-side
 * @param {AxiosInstance} axiosClient - Axios instance for making requests
 * @returns {Promise<boolean>} True if the session is valid server-side
 */
export async function validateAuthenticationServer(axiosClient: any): Promise<boolean> {
	try {
		// Make a lightweight request to a protected endpoint
		// The server will validate HTTP-only cookies automatically
		const response = await axiosClient.get('/auth/validate'); // Adjust endpoint as needed
		return response.status === 200;
	} catch (error) {
		console.log('🚫 Server authentication validation failed:', error);
		return false;
	}
}

/**
 * Checks if the user has a valid session based on Redux state in localStorage
 * @returns {boolean} True if the user appears to have a valid session
 */
export function hasValidSession(): boolean {
	// Check Redux session state in localStorage (primary indicator)
	try {
		const sessionData = localStorage.getItem('session'); // Redux session storage key
		if (!sessionData) {
			console.log('🚫 No Redux session state in localStorage');
			return false;
		}

		const sessionState = JSON.parse(sessionData);

		if (!sessionState?.isLoggedIn || sessionState?.userRut <= 0) {
			console.log('🚫 Invalid Redux session state:', sessionState);
			return false;
		}

		// Also check for API token as secondary validation
		const hasApiToken = getCookieValue('token') !== null;
		if (!hasApiToken) {
			console.log('🚫 No API token found');
			return false;
		}

		console.log('✅ Session validation result: valid', {
			sessionState,
			hasApiToken,
			note: 'HTTP-only auth cookies validated server-side',
		});

		return true;
	} catch (error) {
		console.error('Error checking Redux session state:', error);
		return false;
	}
}
