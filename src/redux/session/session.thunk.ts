import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import validateToken, { type ValidateTokenData } from '@/api/auth/token.validate';
import { refreshUserSession, type SessionRefreshResponse } from '@/api/auth/user.refresh';

interface ValidateParams {
	claims: ValidateTokenData;
	axiosClient: AxiosInstance;
}

export const validateLoggedIn = createAsyncThunk(
	'session/validateLoggedIn',
	async ({ claims, axiosClient }: ValidateParams) => {
		try {
			const response = await validateToken(claims, axiosClient);
			console.log('validateLoggedIn response', response);
			return response.valid;
		} catch (error) {
			console.error('Token validation failed:', error);
			return false;
		}
	}
);

/*
 * SECURE SESSION REFRESH THUNK
 *
 * Validates current session and restores user data from server.
 * Used for handling page refreshes and session restoration.
 */
export const refreshSession = createAsyncThunk<
	SessionRefreshResponse,
	{ axiosClient: AxiosInstance },
	{ rejectValue: string }
>('session/refreshSession', async ({ axiosClient }, { rejectWithValue }) => {
	try {
		const response = await refreshUserSession(axiosClient);
		console.log('Session refresh successful:', response);
		return response;
	} catch (error: any) {
		console.error('Session refresh failed:', error);
		const errorMessage = error.response?.data?.error || 'Session refresh failed';
		return rejectWithValue(errorMessage);
	}
});
