import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import queryClient from '@/api/queryClient.ts';

// import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import './styles/styles.css';
import reportWebVitals from './reportWebVitals.ts';
import store from './redux/store/store.ts';
import axiosClient from './api/axiosClient.ts';
import { useAuthenticatedNavigate } from './hooks/useNavigate.ts';

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		store: store,
		axiosClient: axiosClient,
		queryClient: queryClient,
		navigate: useAuthenticatedNavigate,
	},
	defaultPreload: 'intent',
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
	interface RouterContext {
		store: typeof store;
		axiosClient: typeof axiosClient;
		queryClient: typeof queryClient;
		navigate: typeof useAuthenticatedNavigate;
	}
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
