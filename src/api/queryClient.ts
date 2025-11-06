import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: true,
			retry: (failureCount, error: any) => {
				if (error?.response?.status >= 400 && error?.response?.status <= 499) {
					return false;
				}
				return failureCount < 3;
			},
		},
		mutations: {
			retry: false,
		},
	},
});

export default queryClient;
