import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/login/lang';
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext';

export function AddUserDialog() {
	const lang = useSelector(selectLang);
	const text = langs[lang].dialogs.addUser;
	const [showOtherHospital, setShowOtherHospital] = useState(false);
	const { addUserOpen, setAddUserOpen } = useLoginDialogContext();

	const handleHospitalChange = (value: string) => {
		setShowOtherHospital(value === 'other');
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{text.title}</DialogTitle>
					<DialogDescription>{text.description}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 mt-4'>
					<div className='space-y-2'>
						<Label htmlFor='staff-name'>{text.fields.name}</Label>
						<Input id='staff-name' placeholder={text.placeholders.name} required />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='staff-rut'>{text.fields.rut}</Label>
						<Input id='staff-rut' placeholder={text.placeholders.rut} required />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='staff-email'>{text.fields.email}</Label>
						<Input id='staff-email' type='email' placeholder={text.placeholders.email} required />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='staff-phone'>{text.fields.phone}</Label>
						<Input id='staff-phone' type='tel' placeholder={text.placeholders.phone} required />
					</div>
					<div className='space-y-2'>
						<Label htmlFor='staff-role'>{text.fields.role}</Label>
						<Select>
							<SelectTrigger id='staff-role'>
								<SelectValue placeholder={text.placeholders.role} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='psychiatrist'>{text.roles.psychiatrist}</SelectItem>
								<SelectItem value='general'>{text.roles.general}</SelectItem>
								<SelectItem value='nurse'>{text.roles.nurse}</SelectItem>
								<SelectItem value='assistant'>{text.roles.assistant}</SelectItem>
								<SelectItem value='admin'>{text.roles.admin}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='staff-hospital'>{text.fields.hospital}</Label>
						<Select onValueChange={handleHospitalChange}>
							<SelectTrigger id='staff-hospital'>
								<SelectValue placeholder={text.placeholders.hospital} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='curico'>{text.hospitals.curico}</SelectItem>
								<SelectItem value='san-juan'>{text.hospitals.sanJuan}</SelectItem>
								<SelectItem value='other'>{text.hospitals.other}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{showOtherHospital && (
						<div className='space-y-2'>
							<Label htmlFor='staff-other-hospital'>{text.fields.otherHospital}</Label>
							<Input id='staff-other-hospital' placeholder={text.placeholders.otherHospital} />
						</div>
					)}
					<DialogFooter className='pt-4'>
						<DialogClose asChild>
							<Button type='button' variant='outline'>
								{text.buttons.cancel}
							</Button>
						</DialogClose>
						<Button type='submit' className='bg-cyan-600 hover:bg-cyan-700 text-white'>
							{text.buttons.submit}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

