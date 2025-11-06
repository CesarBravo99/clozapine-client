import { createFormHook } from '@tanstack/react-form';
import { SubmitButton, TextField, Switch, Select } from '@/modules/profile/components/form';
import { fieldContext, formContext } from '@/modules/profile/contexts/profile-form.context';

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		Switch,
		Select,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
