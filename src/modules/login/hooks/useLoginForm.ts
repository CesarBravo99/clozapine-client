import { useAppForm } from '@/modules/login/providers/login-form.provider';
import { useRouteContext } from '@tanstack/react-router';
import { useLoginMutation } from '@/modules/login/hooks/useLoginMutation';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';

export const useLoginForm = () => {
	const { axiosClient } = useRouteContext({ from: '__root__' });
	const lang = useSelector(selectLang);
	const loginMutation = useLoginMutation(axiosClient);

	const form = useAppForm({
		defaultValues: {
			userType: 'patient',
			requestRut: '',
			requestPassword: '',
		},
		onSubmit: ({ value }) => {
			loginMutation.mutate(value);
		},
	});

	return {
		form,
		loginMutation,
		lang,
	};
};
