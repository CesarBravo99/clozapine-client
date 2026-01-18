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

export function PatientForm() {
	const lang = useSelector(selectLang);
	const text = langs[lang].components.forms;
	const {
		hospitals,
		patientSubjects,
		patientForm,
		updatePatientForm,
		submitPatientForm,
		showPatientOtherHospital,
		isSubmitting,
	} = useHelpContext();

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		submitPatientForm();
	};

	return (
		<form className='space-y-4' onSubmit={onSubmit}>
			<div className='space-y-2'>
				<Label>{text.name}</Label>
				<Input
					value={patientForm.name}
					onChange={(event) => updatePatientForm({ name: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.rut}</Label>
				<Input
					value={patientForm.rut}
					onChange={(event) => updatePatientForm({ rut: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.email}</Label>
				<Input
					type='email'
					value={patientForm.email}
					onChange={(event) => updatePatientForm({ email: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.phone}</Label>
				<Input
					value={patientForm.phone}
					onChange={(event) => updatePatientForm({ phone: event.target.value })}
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label>{text.hospital}</Label>
				<Select
					value={patientForm.hospitalId === '' ? undefined : patientForm.hospitalId.toString()}
					onValueChange={(value) => {
						if (value === 'other') {
							updatePatientForm({ hospitalId: 'other' });
						} else {
							updatePatientForm({ hospitalId: Number(value), otherHospital: '' });
						}
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder={text.hospital} />
					</SelectTrigger>
					<SelectContent>
						{hospitals.map((hospital) => (
							<SelectItem key={hospital.affiliationId} value={hospital.affiliationId.toString()}>
								{hospital.name}
							</SelectItem>
						))}
						<SelectItem value='other'>{text.otherHospital}</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{showPatientOtherHospital && (
				<div className='space-y-2'>
					<Label>{text.otherHospital}</Label>
					<Input
						value={patientForm.otherHospital}
						onChange={(event) => updatePatientForm({ otherHospital: event.target.value })}
					/>
				</div>
			)}
			<div className='space-y-2'>
				<Label>{text.subject}</Label>
				<Select
					value={patientForm.subject || undefined}
					onValueChange={(value) => updatePatientForm({ subject: value })}
				>
					<SelectTrigger>
						<SelectValue placeholder={text.subject} />
					</SelectTrigger>
					<SelectContent>
						{patientSubjects.map((subject) => (
							<SelectItem key={subject} value={subject}>
								{subject}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2'>
				<Label>{text.message}</Label>
				<Textarea
					value={patientForm.message}
					onChange={(event) => updatePatientForm({ message: event.target.value })}
					rows={5}
					required
				/>
			</div>
			<Button type='submit' className='w-full' disabled={isSubmitting}>
				{text.send}
			</Button>
		</form>
	);
}

