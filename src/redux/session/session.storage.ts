/*
 * SECURE SESSION STORAGE
 *
 * Only stores non-sensitive UI state that's safe to persist in localStorage.
 * No credentials, roles, or permissions are stored client-side.
 */

import {
	type SessionState,
	getDefaultSessionState,
	SESSION_STATE_STORAGE_KEY,
} from '@/redux/session/session.types';

const defaultSessionState = getDefaultSessionState();

export const loadSessionState = (): SessionState => {
	if (typeof window === 'undefined') {
		return defaultSessionState;
	}

	try {
		const serializedState = localStorage.getItem(SESSION_STATE_STORAGE_KEY);
		if (serializedState === null) {
			return defaultSessionState;
		}

		const parsedState = JSON.parse(serializedState);

		// Validate and construct safe session state
		return {
			isLoggedIn: Boolean(parsedState.isLoggedIn),
			selectedAffiliationId: Number(parsedState.selectedAffiliationId) || -1,
			userRut: Number(parsedState.userRut) || -1,
		};
	} catch (error) {
		console.error('Error loading session state from localStorage:', error);
		return defaultSessionState;
	}
};

export const saveSessionState = (sessionState: SessionState) => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const safeState = {
			isLoggedIn: sessionState.isLoggedIn,
			selectedAffiliationId: sessionState.selectedAffiliationId,
			userRut: sessionState.userRut,
		};
		console.log('🔄 saveSessionState: Saving session state to localStorage:', safeState);
		localStorage.setItem(SESSION_STATE_STORAGE_KEY, JSON.stringify(safeState));
	} catch (error) {
		console.error('Error saving session state to localStorage:', error);
	}
};

export const removeSessionState = () => {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.removeItem(SESSION_STATE_STORAGE_KEY);

	// Also clean up any legacy credential data that might exist
	localStorage.removeItem('creds');
};
