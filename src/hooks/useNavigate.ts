import {
	useNavigate as useTanStackNavigate,
	useRouter,
	type NavigateOptions,
	useRouteContext,
} from '@tanstack/react-router';
import { setUserState } from '@/redux/user/user.slice';
import { sessionLogout } from '@/redux/session/session.slice';
import { getDefaultUserState } from '@/redux/user/user.types';
import { hasAuthenticationCookies } from '@/api/auth/utils';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useAuthenticatedNavigate() {
	const router = useRouter();
	const originalNavigate = useTanStackNavigate();
	const routeContext = useRouteContext({ from: '__root__' });
	const { store, axiosClient } = routeContext;

	const authenticatedNavigate = async (navigateToOptions: NavigateOptions) => {
		await sleep(1000 * 2);
		const currentReduxState = store.getState();
		const currentUser = currentReduxState.user?.user;
		const currentSession = currentReduxState.session;
		const userRut = currentUser?.userRut;
		const selectedAffiliationId = currentSession?.selectedAffiliationId;

		console.log('useAuthenticatedNavigate: Initiating navigation check...');

		const redirectToLogin = (reason: string) => {
			console.warn(`useAuthenticatedNavigate: ${reason}. Redirecting to /login.`);
			// Clear both user and session state
			store.dispatch(setUserState(getDefaultUserState()));
			store.dispatch(sessionLogout());
			originalNavigate({
				to: '/login',
				search: { redirect: router.state.location.href },
				replace: true,
			});
		};

		// --- 1. Primary Authentication Check (from Redux) ---
		if (!currentSession?.isLoggedIn) {
			redirectToLogin('User not logged in (session state)');
			return; // Stop further execution
		}

		// --- 2. Secondary Validation (API call to /validate) ---
		// Define paths that do NOT require this secondary /validate check
		const publicOrNonValidatedPaths = ['/login', '/notifications']; // Notifications has its own validation

		let needsSecondaryValidation = true;
		if (typeof navigateToOptions.to === 'string') {
			if (publicOrNonValidatedPaths.includes(navigateToOptions.to)) {
				needsSecondaryValidation = false;
			}
		}

		if (needsSecondaryValidation) {
			console.log(
				'useAuthenticatedNavigate: Performing secondary validation via /refresh endpoint...'
			);
			if (!userRut) {
				redirectToLogin('User RUT missing for validation');
				return;
			}

			// Check if we have authentication cookies before making the API call
			if (!hasAuthenticationCookies()) {
				redirectToLogin('Authentication cookies missing');
				return;
			}

			try {
				// Use the secure refresh endpoint instead of the old validate endpoint
				const response = await axiosClient.post('/refresh');
				console.log('useAuthenticatedNavigate: /refresh response', response);

				if (response.status !== 200) {
					redirectToLogin('User validation failed via /refresh (status not 200)');
					return;
				}
				console.log('useAuthenticatedNavigate: User is authorized by /refresh.');
			} catch (error) {
				redirectToLogin(`Error during /refresh for user ${userRut}`);
				return;
			}
		} else {
			console.log(
				'useAuthenticatedNavigate: Skipping secondary validation check for this navigation.'
			);
		}

		// --- 3. If all checks pass, proceed with the original navigation ---
		console.log(
			'useAuthenticatedNavigate: All checks passed. Proceeding with navigation to:',
			navigateToOptions.to
		);
		await originalNavigate(navigateToOptions);
	};

	return authenticatedNavigate;
}
