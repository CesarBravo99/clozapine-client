/*
 * SECURE SESSION SLICE
 *
 * Manages authentication session state for UI purposes only.
 * No sensitive credentials stored - all authorization handled server-side.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
	loadSessionState,
	removeSessionState,
	saveSessionState,
} from '@/redux/session/session.storage';
import { type SessionState, getDefaultSessionState } from '@/redux/session/session.types';
import { validateLoggedIn } from './session.thunk';

const sessionSlice = createSlice({
	name: 'session',
	initialState: loadSessionState() as SessionState,
	reducers: {
		sessionLogin: (
			state: SessionState,
			action: PayloadAction<{ userRut: number; selectedAffiliationId?: number }>
		) => {
			state.isLoggedIn = true;
			state.userRut = action.payload.userRut;
			state.selectedAffiliationId = action.payload.selectedAffiliationId || -1;
			saveSessionState(state);
			return state;
		},

		sessionLogout: (state: SessionState) => {
			const defaultState = getDefaultSessionState();
			state.isLoggedIn = defaultState.isLoggedIn;
			state.selectedAffiliationId = defaultState.selectedAffiliationId;
			state.userRut = defaultState.userRut;
			removeSessionState();
			return state;
		},

		setSelectedAffiliationId: (state: SessionState, action: PayloadAction<number>) => {
			state.selectedAffiliationId = action.payload;
			saveSessionState(state);
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(validateLoggedIn.fulfilled, (state, action) => {
			state.isLoggedIn = action.payload;
			if (!action.payload) {
				// If validation fails, clear session
				const defaultState = getDefaultSessionState();
				state.selectedAffiliationId = defaultState.selectedAffiliationId;
				state.userRut = defaultState.userRut;
				removeSessionState();
			}
		});
	},
	selectors: {
		selectSessionState: (state: SessionState) => state,
		selectIsLoggedIn: (state: SessionState) => state?.isLoggedIn,
		selectSelectedAffiliationId: (state: SessionState) => state?.selectedAffiliationId,
		selectUserRut: (state: SessionState) => state?.userRut, // For display purposes only
	},
});

export const { sessionLogin, sessionLogout, setSelectedAffiliationId } = sessionSlice.actions;

export const { selectSessionState, selectIsLoggedIn, selectSelectedAffiliationId, selectUserRut } =
	sessionSlice.selectors;

export default sessionSlice.reducer;
