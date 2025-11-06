import { type SettingsState, SETTINGS_STATE_STORAGE_KEY } from '@/redux/settings/settings.types';
import { type SessionState, SESSION_STATE_STORAGE_KEY } from '@/redux/session/session.types';
import { saveSettingsState } from '@/redux/settings/settings.storage';
import { saveSessionState } from '@/redux/session/session.storage';
import { userLogout } from '@/redux/user/user.slice';
import { type AppDispatch } from '@/redux/store/store';
import { sessionLogout } from '../session/session.slice';

export const saveToLocalStorage = (state: { settings: SettingsState; session: SessionState }) => {
	if (typeof window === 'undefined') {
		return;
	}
	try {
		saveSettingsState(state.settings);
		saveSessionState(state.session);
	} catch (e) {
		console.error('Could not save state to localStorage:', e);
	}
};

export const loadFromLocalStorage = () => {
	if (typeof window === 'undefined') {
		return undefined;
	}
	try {
		const serializedSettings = localStorage.getItem(SETTINGS_STATE_STORAGE_KEY);
		const serializedSession = localStorage.getItem(SESSION_STATE_STORAGE_KEY);

		console.log('loading settings from localStorage');

		// Load settings and session independently
		let settings = null;
		let session = null;

		if (serializedSettings !== null) {
			try {
				settings = JSON.parse(serializedSettings);
				console.log('✅ Settings loaded from localStorage:', settings);
			} catch (e) {
				console.error('Failed to parse settings from localStorage:', e);
			}
		} else {
			console.log('⚠️ No settings found in localStorage');
		}

		if (serializedSession !== null) {
			try {
				session = JSON.parse(serializedSession);
				console.log('✅ Session loaded from localStorage:', session);
			} catch (e) {
				console.error('Failed to parse session from localStorage:', e);
			}
		} else {
			console.log('⚠️ No session found in localStorage');
		}

		// Return partial state - even if only one is available
		if (settings || session) {
			return {
				settings: settings,
				session: session,
			};
		}

		console.log('ℹ️ No persisted state found in localStorage');
		return undefined;
	} catch (e) {
		console.error('Could not load state from localStorage:', e);
		return undefined;
	}
};

export const clearLocalStorage = (dispatch: AppDispatch) => {
	if (typeof window === 'undefined') {
		return;
	}
	dispatch(userLogout());
	dispatch(sessionLogout());
	document.cookie = `token=${document.cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
