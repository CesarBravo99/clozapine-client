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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/login/lang';
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext';

export function AffiliationChangeDialog() {
	const lang = useSelector(selectLang);
	const text = langs[lang].dialogs.affiliation;
	const { affiliationOpen, setAffiliationOpen } = useLoginDialogContext();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [hospital, setHospital] = useState('');
	const [otherHospital, setOtherHospital] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShowConfirmation(true);
	};

	const handleOpenChange = (open: boolean) => {
		setAffiliationOpen(open);
		if (!open) {
			setShowConfirmation(false);
			setHospital('');
			setOtherHospital('');
		}
	};

	return (
		<Dialog open={affiliationOpen} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{text.title}</DialogTitle>
					<DialogDescription>{text.description}</DialogDescription>
				</DialogHeader>
				{showConfirmation ? (
					<div className='p-4'>
						<Alert className='bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'>
							<div className='flex items-start gap-3'>
								<CheckCircle2 className='h-5 w-5 text-green-500 dark:text-green-400' />
								<AlertDescription className='text-green-800 dark:text-green-200'>
									{text.successMessage}
								</AlertDescription>
							</div>
						</Alert>
						<DialogFooter className='mt-4'>
							<DialogClose asChild>
								<Button type='button' variant='secondary'>
									{text.buttons.close}
								</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='change-rut'>{text.fields.rut}</Label>
								<Input id='change-rut' placeholder={text.placeholders.rut} required />
							</div>
							<div className='space-y-2'>
								<Label htmlFor='change-email'>{text.fields.email}</Label>
								<Input id='change-email' type='email' placeholder={text.placeholders.email} required />
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='change-phone'>{text.fields.phone}</Label>
							<Input id='change-phone' type='tel' placeholder={text.placeholders.phone} required />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='change-reason'>{text.fields.reason}</Label>
							<Textarea id='change-reason' placeholder={text.placeholders.reason} required />
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='change-hospital'>{text.fields.hospital}</Label>
								<Select onValueChange={setHospital} value={hospital}>
									<SelectTrigger id='change-hospital'>
										<SelectValue placeholder={text.placeholders.hospital} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='no-indicar'>{text.hospitals.hide}</SelectItem>
										<SelectItem value='curico'>{text.hospitals.curico}</SelectItem>
										<SelectItem value='san-juan'>{text.hospitals.sanJuan}</SelectItem>
										<SelectItem value='other'>{text.hospitals.other}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{hospital === 'other' && (
								<div className='space-y-2'>
									<Label htmlFor='change-other-hospital'>{text.fields.otherHospital}</Label>
									<Input
										id='change-other-hospital'
										value={otherHospital}
										onChange={(event) => setOtherHospital(event.target.value)}
										placeholder={text.placeholders.otherHospital}
										required
									/>
								</div>
							)}
						</div>
						<DialogFooter className='pt-4'>
							<DialogClose asChild>
								<Button type='button' variant='outline'>
									{text.buttons.cancel}
								</Button>
							</DialogClose>
							<Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white'>
								{text.buttons.submit}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}

