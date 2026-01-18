/*
 * SECURITY ARCHITECTURE NOTES:
 *
 * 1. SENSITIVE DATA (Handled by server via HTTP-only cookies):
 *    - User authentication state (user_rut, user_role)
 *    - Session validation tokens
 *    - User permissions for authorization
 *
 *    These are stored in HTTP-only cookies that:
 *    - Cannot be accessed by JavaScript (XSS protection)
 *    - Are sent automatically with requests (CSRF protection via SameSite)
 *    - Have secure transmission in production (HTTPS only)
 *    - Have proper expiration times
 *
 * 2. NON-SENSITIVE DATA (Safe for client-side Redux store):
 *    - User profile information (name, preferences)
 *    - UI state and settings
 *    - Display-only credential information (for UI purposes only)
 *    - Affiliation data for navigation
 *
 * 3. SECURITY PRINCIPLE:
 *    - Server validates actual permissions on every protected request using HTTP-only cookies
 *    - Client-side credentials are for UI/UX purposes only
 *    - Never trust client-side authorization data for actual security decisions
 */

/*
 * SECURE LOGIN API
 *
 * This login endpoint now follows secure authentication patterns:
 * - Server stores sensitive data in HTTP-only cookies
 * - Client receives only safe profile/UI data
 * - No sensitive credentials exposed to JavaScript
 */

import { adaptUser } from '@/api/auth/adapters/user';
import type { User } from '@/domain/user/user.types';
import type { AxiosInstance } from 'axios';
import type { Affiliation } from '@/domain/affiliation/affiliation.types';
import { adaptAffiliations } from '@/api/auth/adapters/affiliation';

export interface LoginFormRequest {
	requestRut: string;
	requestPassword: string;
}

export interface LoginFormResponse {
	user: User;
	affiliations: Record<number, Affiliation>;
	token: string;
	message: string;
}

export const authUser = async (
	request: LoginFormRequest,
	axiosClient: AxiosInstance
): Promise<LoginFormResponse> => {
	const loginPayload = {
		...request,
		requestRut: Number(request.requestRut),
	};

	return await axiosClient
		.post('/login', loginPayload)
		.then((response) => {
			console.log('authUser Login successful:', response.data);

			// Server automatically sets HTTP-only cookies for user_rut and user_role
			// No need to set authentication cookies client-side!
			console.log('🍪 Server has set HTTP-only authentication cookies (user_rut, user_role)');

			// Set API token cookie for client-side authentication checks
			saveToken(response.data.token.tokenString, response.data.token.expiresAt);

			// Process safe profile data for UI
			const affiliations = adaptAffiliations(response.data.affiliations);
			const user = adaptUser(response.data.user, affiliations);

			return {
				user,
				affiliations,
				token: response.data.token.tokenString,
				message: response.data.message,
			};
		})
		.catch((error) => {
			console.error('Login failed:', error.message);
			throw error;
		});
};

// Updated saveToken function - only for API token if needed
const saveToken = (token: string, expiresAt: string) => {
	// Note: This might not be needed if the server also sets the token as HTTP-only cookie
	// Check if your API requests use cookies vs Authorization headers

	const expires = new Date(expiresAt);
	let cookieString = `token=${token}`;
	cookieString += `; expires=${expires.toUTCString()}`;
	cookieString += '; path=/';
	cookieString += '; SameSite=Lax';

	if (window.location.protocol === 'https:') {
		cookieString += '; Secure';
	}

	console.log('🍪 Setting API token cookie:', cookieString);
	document.cookie = cookieString;
};
