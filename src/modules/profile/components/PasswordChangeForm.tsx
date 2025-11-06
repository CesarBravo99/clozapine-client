import { useAppForm } from '@/modules/profile/providers/profile-form.provider';
import { useChangePasswordMutation } from '@/modules/profile/hooks/useChangePasswordMutation';
import { useRouteContext } from '@tanstack/react-router';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const passwordChangeSchema = z
	.object({
		currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
		newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
		confirmPassword: z.string().min(1, 'Confirmar la contraseña es requerido'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	});

interface PasswordChangeFormProps {
	userRut: number;
}

export function PasswordChangeForm({ userRut }: PasswordChangeFormProps) {
	const routeContext = useRouteContext({ from: '__root__' });
	const { axiosClient } = routeContext;
	const changePasswordMutation = useChangePasswordMutation(axiosClient, userRut);

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useAppForm({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
		validators: {
			onBlur: passwordChangeSchema,
		},
		onSubmit: ({ value }) => {
			changePasswordMutation.mutate({
				currentPassword: value.currentPassword,
				newPassword: value.newPassword,
			});
		},
	});

	// Reset form on successful password change
	if (changePasswordMutation.isSuccess) {
		form.reset();
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className='space-y-6'
		>
			<div className='space-y-4'>
				<h4 className='text-md font-semibold text-gray-800 dark:text-white'>
					Cambiar Contraseña
				</h4>

				<div className='relative'>
					<form.AppField name='currentPassword'>
						{(field) => (
							<field.TextField
								label='Contraseña Actual'
								placeholder='Ingrese su contraseña actual'
								type={showCurrentPassword ? 'text' : 'password'}
							/>
						)}
					</form.AppField>
					<button
						type='button'
						onClick={() => setShowCurrentPassword(!showCurrentPassword)}
						className='absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
					>
						{showCurrentPassword ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>

				<div className='relative'>
					<form.AppField name='newPassword'>
						{(field) => (
							<field.TextField
								label='Nueva Contraseña'
								placeholder='Ingrese su nueva contraseña'
								type={showNewPassword ? 'text' : 'password'}
							/>
						)}
					</form.AppField>
					<button
						type='button'
						onClick={() => setShowNewPassword(!showNewPassword)}
						className='absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
					>
						{showNewPassword ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>

				<div className='relative'>
					<form.AppField name='confirmPassword'>
						{(field) => (
							<field.TextField
								label='Confirmar Nueva Contraseña'
								placeholder='Confirme su nueva contraseña'
								type={showConfirmPassword ? 'text' : 'password'}
							/>
						)}
					</form.AppField>
					<button
						type='button'
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className='absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
					>
						{showConfirmPassword ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>
			</div>

			{changePasswordMutation.isError && (
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
					<p className='text-red-700 dark:text-red-400'>
						Error al cambiar la contraseña: {changePasswordMutation.error?.message}
					</p>
				</div>
			)}

			{changePasswordMutation.isSuccess && (
				<div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
					<p className='text-green-700 dark:text-green-400'>
						Contraseña cambiada exitosamente
					</p>
				</div>
			)}

			<div className='flex justify-end'>
				<form.AppForm>
					<form.SubmitButton
						label={
							changePasswordMutation.isPending ? 'Cambiando...' : 'Cambiar Contraseña'
						}
						disabled={changePasswordMutation.isPending}
					/>
				</form.AppForm>
			</div>
		</form>
	);
}
