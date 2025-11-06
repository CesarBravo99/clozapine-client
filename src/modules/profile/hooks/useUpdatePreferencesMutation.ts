import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserPreferences } from '@/api/profile';
import type { AxiosInstance } from 'axios';

interface UpdatePreferencesRequest {
	userTheme?: string;
	userLanguage?: string;
	userFontSize?: number;
	userTimezone?: string;
	emailNotifications?: boolean;
	whatsappNotifications?: boolean;
}

export function useUpdatePreferencesMutation(axiosClient: AxiosInstance, userRut: number) {
	const queryClient = useQueryClient();

	return useMutation<void, Error, UpdatePreferencesRequest>({
		mutationFn: (preferences) => updateUserPreferences(userRut, preferences, axiosClient),
		onSuccess: () => {
			// Invalidate and refetch profile data
			queryClient.invalidateQueries({ queryKey: ['profile', userRut] });
		},
		onError: (error) => {
			console.error('Failed to update preferences:', error.message);
		},
	});
}
