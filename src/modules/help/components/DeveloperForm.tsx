import type { FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/help/lang';
import { useHelpContext } from '@/modules/help/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function DeveloperForm() {
	const lang = useSelector(selectLang);
	const text = langs[lang].components.forms;
	const {
		developerForm,
		updateDeveloperForm,
		submitDeveloperForm,
		developerIssueTypes,
		developerPriorities,
		isSubmitting,
	} = useHelpContext();

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		submitDeveloperForm();
	};

	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<div className='space-y-2'>
				<Label>{text.name}</Label>
				<Input
					value={developerForm.name}
					onChange={(event) => updateDeveloperForm({ name: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.email}</Label>
				<Input
					type='email'
					value={developerForm.email}
					onChange={(event) => updateDeveloperForm({ email: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.issueType}</Label>
				<Select
					value={developerForm.issueType || undefined}
					onValueChange={(value) => updateDeveloperForm({ issueType: value })}
				>
					<SelectTrigger>
						<SelectValue placeholder={text.issueType} />
					</SelectTrigger>
					<SelectContent>
						{developerIssueTypes.map((issue) => (
							<SelectItem key={issue} value={issue}>
								{issue}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2'>
				<Label>{text.priority}</Label>
				<Select
					value={developerForm.priority || undefined}
					onValueChange={(value) => updateDeveloperForm({ priority: value })}
				>
					<SelectTrigger>
						<SelectValue placeholder={text.priority} />
					</SelectTrigger>
					<SelectContent>
						{developerPriorities.map((priority) => (
							<SelectItem key={priority} value={priority}>
								{priority}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2'>
				<Label>{text.message}</Label>
				<Textarea
					rows={5}
					value={developerForm.message}
					onChange={(event) => updateDeveloperForm({ message: event.target.value })}
					required
				/>
			</div>
			<Button type='submit' className='w-full' disabled={isSubmitting}>
				{text.send}
			</Button>
		</form>
	);
}

