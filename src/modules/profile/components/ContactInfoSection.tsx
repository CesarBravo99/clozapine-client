import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/profile/lang';

interface ContactInfoSectionProps {
	email: string;
	phone: string;
	onChange: (field: 'email' | 'phone', value: string) => void;
	onSave: () => void;
	isSaving: boolean;
}

export function ContactInfoSection({
	email,
	phone,
	onChange,
	onSave,
	isSaving,
}: ContactInfoSectionProps) {
	const lang = useSelector(selectLang);
	const text = langs[lang].components.contactInfo;

	return (
		<Card className='w-full md:w-1/2'>
			<CardHeader>
				<CardTitle className='text-lg flex items-center gap-2'>
					<Mail className='h-5 w-5 text-blue-500' />
					{text.title}
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='email'>{text.emailLabel}</Label>
					<Input
						id='email'
						type='email'
						value={email}
						onChange={(event) => onChange('email', event.target.value)}
						placeholder={text.emailPlaceholder}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='phone'>{text.phoneLabel}</Label>
					<Input
						id='phone'
						type='tel'
						value={phone}
						onChange={(event) => onChange('phone', event.target.value)}
						placeholder={text.phonePlaceholder}
					/>
				</div>
			</CardContent>
			<CardFooter className='flex justify-end'>
				<Button
					className='bg-blue-500 hover:bg-blue-600'
					onClick={onSave}
					disabled={isSaving}
				>
					{isSaving ? text.saving : text.save}
				</Button>
			</CardFooter>
		</Card>
	);
}

