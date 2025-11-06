import { useMutation } from '@tanstack/react-query';
import { authUser, type LoginFormRequest, type LoginFormResponse } from '@/api/auth/user.login';
import { useLoginSuccess } from '@/modules/login/hooks/useLoginSuccess';
import type { AxiosInstance } from 'axios';

export function useLoginMutation(axiosClient: AxiosInstance) {
	const handleLoginSuccess = useLoginSuccess();

	const loginMutation = useMutation<LoginFormResponse, Error, LoginFormRequest>({
		mutationFn: (formRequest) => authUser(formRequest, axiosClient),
		onSuccess: (response) => handleLoginSuccess(response),
		onError: (error) => {
			console.error('Login failed:', error.message);
		},
	});

	return loginMutation;
}
