import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePatients } from '../context/PatientsContext';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '../lang';

export function AddPatientListDialog() {
	const {
		isAddPatientListOpen,
		closeAddPatientListDialog,
	} = usePatients();
	const lang = useSelector(selectLang);
	const dictionary = langs[lang].dialogs.addPatientList;
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		rust: '',
		email: '',
		phone: '',
		status: 'active',
		nextControl: '',
	});

	const resetForm = () => {
		setForm({
			firstName: '',
			lastName: '',
			rust: '',
			email: '',
			phone: '',
			status: 'active',
			nextControl: '',
		});
	};

	const handleClose = (open: boolean) => {
		if (!open) {
			resetForm();
			closeAddPatientListDialog();
		}
	};

	const handleSubmit = () => {
		console.log('➕ Adding patient (mock):', form);
		resetForm();
		closeAddPatientListDialog();
	};

	return (
		<Dialog open={isAddPatientListOpen} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-[520px]'>
				<DialogHeader>
					<DialogTitle>{dictionary.title}</DialogTitle>
					<DialogDescription>{dictionary.subtitle}</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>{dictionary.firstName}</Label>
							<Input
								id='firstName'
								value={form.firstName}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, firstName: event.target.value }))
								}
								placeholder={dictionary.placeholder.firstName}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>{dictionary.lastName}</Label>
							<Input
								id='lastName'
								value={form.lastName}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, lastName: event.target.value }))
								}
								placeholder={dictionary.placeholder.lastName}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='rut'>{dictionary.rut}</Label>
						<Input
							id='rut'
							value={form.rut}
							onChange={(event) => setForm((prev) => ({ ...prev, rut: event.target.value }))}
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>{dictionary.email}</Label>
							<Input
								id='email'
								type='email'
								value={form.email}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, email: event.target.value }))
								}
								placeholder={dictionary.placeholder.email}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>{dictionary.phone}</Label>
							<Input
								id='phone'
								value={form.phone}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, phone: event.target.value }))
								}
								placeholder={dictionary.placeholder.phone}
							/>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='status'>{dictionary.status}</Label>
							<select
								id='status'
								className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
								value={form.status}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, status: event.target.value }))
								}
							>
								<option value='active'>{langs[lang].patients.states.active}</option>
								<option value='inactive'>{langs[lang].patients.states.inactive}</option>
								<option value='suspended'>{langs[lang].patients.states.suspended}</option>
							</select>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='nextControl'>{dictionary.nextControl}</Label>
							<Input
								id='nextControl'
								type='date'
								value={form.nextControl}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, nextControl: event.target.value }))
								}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => handleClose(false)}>
						{dictionary.cancel}
					</Button>
					<Button onClick={handleSubmit}>{dictionary.submit}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
