import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { NotificationPatientSummary } from '../context/NotificationContext';
import { Calendar, Clock, User, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';

export interface AppointmentFormData {
	date: string;
	time: string;
	type: string;
	notes: string;
}

interface AddAppointmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	patient?: NotificationPatientSummary | null;
	onAddEvent?: (payload: AppointmentFormData & { patientRut?: number }) => void;
}

const DEFAULT_FORM: AppointmentFormData = {
	date: '',
	time: '',
	type: '',
	notes: '',
};

export function AddAppointmentDialog({
	open,
	onOpenChange,
	patient,
	onAddEvent,
}: AddAppointmentDialogProps) {
	const [form, setForm] = useState<AppointmentFormData>(DEFAULT_FORM);
	const [formError, setFormError] = useState<string | null>(null);
	const lang = useSelector(selectLang);
	const dictionary = langs[lang].dialogs.addAppointment;

	const handleClose = (value: boolean) => {
		if (!value) {
			setForm(DEFAULT_FORM);
			setFormError(null);
		}
		onOpenChange(value);
	};

	const handleSubmit = () => {
		if (!form.date || !form.time) {
			setFormError(dictionary.errorMissingFields);
			return;
		}

		onAddEvent?.({
			...form,
			patientRut: patient?.patientRut,
		});

		handleClose(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-[520px]'>
				<DialogHeader>
					<DialogTitle>{dictionary.title}</DialogTitle>
					<DialogDescription>{dictionary.description}</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-2'>
					<div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900'>
						<div className='flex flex-col gap-2'>
							<div className='flex items-center gap-2 font-medium'>
								<User className='h-4 w-4 text-gray-500' />
								<span>
									{patient?.fullName ?? dictionary.patientFallback}
									{patient?.rutFormatted ? ` • ${patient.rutFormatted}` : ''}
								</span>
							</div>
							{patient?.state && (
								<p className='text-xs text-gray-500'>
									{dictionary.patientStateLabel}:{' '}
									<strong>{patient.state}</strong>
								</p>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='appointment-date' className='flex items-center gap-2 text-sm font-medium'>
								<Calendar className='h-4 w-4 text-gray-500' />
								{dictionary.dateLabel}
							</Label>
							<Input
								id='appointment-date'
								type='date'
								value={form.date}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, date: event.target.value }))
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='appointment-time' className='flex items-center gap-2 text-sm font-medium'>
								<Clock className='h-4 w-4 text-gray-500' />
								{dictionary.timeLabel}
							</Label>
							<Input
								id='appointment-time'
								type='time'
								value={form.time}
								onChange={(event) =>
									setForm((prev) => ({ ...prev, time: event.target.value }))
								}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='appointment-type'>{dictionary.typeLabel}</Label>
						<Input
							id='appointment-type'
							placeholder={dictionary.typePlaceholder}
							value={form.type}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, type: event.target.value }))
							}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='appointment-notes'>{dictionary.notesLabel}</Label>
						<Textarea
							id='appointment-notes'
							placeholder={dictionary.notesPlaceholder}
							value={form.notes}
							onChange={(event) =>
								setForm((prev) => ({ ...prev, notes: event.target.value }))
							}
							className='min-h-[120px]'
						/>
					</div>

					{formError && (
						<p className='text-sm text-red-500 dark:text-red-400'>{formError}</p>
					)}
				</div>

				<DialogFooter className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
					<Button variant='outline' onClick={() => handleClose(false)}>
						<X className='mr-2 h-4 w-4' />
						{dictionary.cancel}
					</Button>
					<Button onClick={handleSubmit}>{dictionary.confirm}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

