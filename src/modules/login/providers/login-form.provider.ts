import { createFormHook } from '@tanstack/react-form';
import { SubscribeButton, TextArea, TextField } from '@/modules/login/components/form';
import { fieldContext, formContext } from '@/modules/login/contexts/login-form.context';

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		TextArea,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
