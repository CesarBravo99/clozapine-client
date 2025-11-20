import { useAppForm } from '@/modules/login/providers/login-form.provider';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/login/lang';
import { useRouteContext } from '@tanstack/react-router';
import { useLoginMutation } from '@/modules/login/hooks/useLoginMutation';

export function PatientForm() {
	const routeContext = useRouteContext({ from: '__root__' });
	const loginMutation = useLoginMutation(routeContext.axiosClient);
	const lang = useSelector(selectLang);

	const schema = z.object({
		requestRut: z.string().min(1, langs[lang].login.rutErrorMessage),
		patientEmail: z.string().min(1, langs[lang].login.emailErrorMessage).email(),
	});

	const form = useAppForm({
		defaultValues: {
			requestRut: '',
			patientEmail: '',
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: ({ value }) => {
			const payload = {
				requestRut: value.requestRut,
				requestPassword: value.patientEmail,
			};
			loginMutation.mutate(payload);
		},
	});

	return (
		<form
			id='patient-form'
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className='space-y-6'
		>
			<form.AppField name='requestRut'>
				{(field) => (
					<field.TextField
						label={langs[lang].login.rutLabel}
						placeholder={langs[lang].login.rutPlaceholder}
					/>
				)}
			</form.AppField>

			<form.AppField name='patientEmail'>
				{(field) => (
					<field.TextField
						label={langs[lang].login.emailLabel}
						placeholder={langs[lang].login.emailPlaceholder}
					/>
				)}
			</form.AppField>

			<div className='flex justify-end'>
				<form.AppForm>
					<form.SubscribeButton
						label={
							loginMutation.isPending
								? langs[lang].userForm.submittingButtonPatient
								: langs[lang].userForm.submitButtonPatient
						}
						disabled={loginMutation.isPending}
						type='patient'
					/>
				</form.AppForm>
			</div>
		</form>
	);
}
