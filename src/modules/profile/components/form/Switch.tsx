import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '../../contexts/profile-form.context';
import { Switch as SwitchComponent } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ErrorMessages } from './ErrorMessages';

interface SwitchProps {
	label: string;
	description?: string;
}

export function Switch({ label, description }: SwitchProps) {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, (state) => state.meta.errors);

	return (
		<div className='flex items-center justify-between space-x-2'>
			<div className='space-y-0.5'>
				<Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
					{label}
				</Label>
				{description && (
					<p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
				)}
			</div>
			<SwitchComponent
				checked={field.state.value || false}
				onCheckedChange={(checked) => field.handleChange(checked)}
			/>
			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
}
