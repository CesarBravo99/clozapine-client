/*
 * SECURE SESSION REFRESH API
 *
 * This API validates the current session (HTTP-only cookies + token)
 * and returns user data for state restoration after page refresh.
 *
 * Security Features:
 * - Uses HTTP-only cookies for authentication
 * - Validates session server-side
 * - Returns safe user data for Redux state
 */

import { adaptUser } from '@/api/auth/adapters/user';
import { adaptAffiliations } from '@/api/auth/adapters/affiliation';
import type { User } from '@/domain/user/user.types';
import type { Affiliation } from '@/domain/affiliation/affiliation.types';
import type { AxiosInstance } from 'axios';

export interface SessionRefreshResponse {
	user: User;
	affiliations: Record<number, Affiliation>;
	message: string;
}

export const refreshUserSession = async (
	axiosClient: AxiosInstance
): Promise<SessionRefreshResponse> => {
	try {
		const response = await axiosClient.post('/refresh');

		console.log('Session refresh successful:', response.data);

		// Process safe user data for Redux state
		const affiliations = adaptAffiliations(response.data.affiliations);
		const user = adaptUser(response.data.user, affiliations);

		return {
			user,
			affiliations,
			message: response.data.message,
		};
	} catch (error) {
		console.error('Session refresh failed:', error);
		throw error;
	}
};
