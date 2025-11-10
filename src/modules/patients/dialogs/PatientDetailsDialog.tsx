import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, FolderOpen, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { usePatients } from '../context/PatientsContext';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '../lang';
import { cn } from '@/lib/utils';
import { LanguageState } from '@/redux/settings/settings.types';
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import type { ReactNode } from 'react';

export function PatientDetailsDialog() {
	const {
		selectedPatient,
		selectedPatientDetail,
		isPatientDetailsOpen,
		isPatientDetailsLoading,
		patientDetailsError,
		closePatientDetails,
	} = usePatients();
	const lang = useSelector(selectLang);
	const dictionary = langs[lang].dialogs.patientDetails;
	const locale = lang === LanguageState.ES ? es : enUS;

	if (!selectedPatient) {
		return null;
	}

	const detail = selectedPatientDetail;

	const fullName = detail
		? `${detail.firstName} ${detail.lastName}`.trim()
		: selectedPatient.name;
	const initials = fullName
		.split(' ')
		.filter(Boolean)
		.map((segment) => segment[0]?.toUpperCase())
		.join('')
		.slice(0, 2);

	const formattedRut = formatRut(detail?.patientRut ?? selectedPatient.patientRut);
	const age = detail?.birthday ? calculateAge(detail.birthday) : selectedPatient.age;
	const birthdate =
		detail?.birthday ? formatDate(detail.birthday, locale) ?? dictionary.notAvailable : dictionary.notAvailable;
	const gender = detail ? mapGender(detail.sex, dictionary.genderOptions) : dictionary.notAvailable;
	const medicalCenter =
		detail?.mainAffiliationName ?? dictionary.medicalCenterFallback;
	const email = detail?.email || dictionary.emailFallback;
	const phone = detail?.phone || dictionary.phoneFallback;
	const address = detail?.address || dictionary.addressFallback;
	const diagnosis = detail?.diagnosis || dictionary.diagnosisFallback;
	const lastControl =
		(detail?.lastControl && (formatDate(detail.lastControl, locale) ?? null)) ||
		selectedPatient.lastControl ||
		dictionary.lastControlFallback;
	const nextControl =
		(detail?.nextControl && (formatDate(detail.nextControl, locale) ?? null)) ||
		dictionary.nextControlFallback;

	const statusLabel = selectedPatient.state;
	const stateClassName = getStatusClass(statusLabel);

	return (
		<Dialog open={isPatientDetailsOpen} onOpenChange={(open) => !open && closePatientDetails()}>
			<DialogContent className='sm:max-w-[620px]'>
				<DialogHeader>
					<DialogTitle>{dictionary.title}</DialogTitle>
					<DialogDescription>{dictionary.subtitle}</DialogDescription>
				</DialogHeader>

				{isPatientDetailsLoading && (
					<div className='flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'>
						<Loader2 className='h-4 w-4 animate-spin' />
						<span>{dictionary.loading}</span>
					</div>
				)}

				{patientDetailsError && (
					<div className='rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300'>
						<strong className='font-semibold'>{dictionary.error}</strong>
						{': '}
						{patientDetailsError}
					</div>
				)}

				<div className='space-y-6 py-2'>
					<section className='flex flex-col gap-4 sm:flex-row sm:items-start'>
						<Avatar className='h-16 w-16 text-lg'>
							<AvatarFallback className='bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'>
								{initials || 'PT'}
							</AvatarFallback>
						</Avatar>
						<div className='space-y-1'>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-50'>{fullName}</h3>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								{dictionary.rutLabel}: {formattedRut ?? dictionary.notAvailable}
							</p>
							<span
								className={cn(
									'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize',
									stateClassName
								)}
							>
								{statusLabel}
							</span>
						</div>
					</section>

					<Separator />

					<section className='space-y-4'>
						<h4 className='text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
							{dictionary.personalInfoTitle}
						</h4>
						<div className='grid gap-3 text-sm md:grid-cols-2 md:gap-5'>
							<InfoRow label={dictionary.ageLabel} value={age != null ? `${age}` : dictionary.notAvailable} />
							<InfoRow label={dictionary.birthdateLabel} value={birthdate} />
							<InfoRow label={dictionary.genderLabel} value={gender} />
							<InfoRow label={dictionary.medicalCenterLabel} value={medicalCenter} />
						</div>
					</section>

					<Separator />

					<section className='space-y-4'>
						<h4 className='text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
							{dictionary.contactInfoTitle}
						</h4>
						<div className='space-y-3 text-sm'>
							<InfoRow icon={<Mail className='h-3.5 w-3.5' />} label={dictionary.emailLabel} value={email} />
							<InfoRow icon={<Phone className='h-3.5 w-3.5' />} label={dictionary.phoneLabel} value={phone} />
							<InfoRow icon={<MapPin className='h-3.5 w-3.5' />} label={dictionary.addressLabel} value={address} multiline />
						</div>
					</section>

					<Separator />

					<section className='space-y-4'>
						<h4 className='text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
							{dictionary.clinicalInfoTitle}
						</h4>
						<div className='grid gap-3 text-sm md:grid-cols-2 md:gap-5'>
							<InfoRow label={dictionary.diagnosisLabel} value={diagnosis} />
							<InfoRow label={dictionary.statusLabel} value={statusLabel} />
							<InfoRow label={dictionary.lastControlLabel} value={lastControl} />
							<InfoRow label={dictionary.nextControlLabel} value={nextControl} />
						</div>
					</section>
				</div>

				<DialogFooter className='flex flex-wrap justify-end gap-2'>
					<Button variant='outline' onClick={() => console.log('📑 View exams for', formattedRut)}>
						<FolderOpen className='mr-2 h-4 w-4' />
						{dictionary.viewExams}
					</Button>
					<Button variant='outline' onClick={() => console.log('📄 View record for', formattedRut)}>
						<FileText className='mr-2 h-4 w-4' />
						{dictionary.viewRecord}
					</Button>
					<Button onClick={() => console.log('📅 Schedule appointment for', formattedRut)}>
						<Calendar className='mr-2 h-4 w-4' />
						{dictionary.scheduleAppointment}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function InfoRow({
	label,
	value,
	icon,
	multiline = false,
}: {
	label: string;
	value: string;
	icon?: ReactNode;
	multiline?: boolean;
}) {
	return (
		<div className='flex items-start justify-between gap-3'>
			<span className='flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-400'>
				{icon ? <span className='mt-0.5 text-gray-400 dark:text-gray-500'>{icon}</span> : null}
				{label}
			</span>
			<span
				className={cn(
					'text-sm font-semibold text-gray-900 dark:text-gray-100',
					multiline ? 'max-w-[70%] text-right md:text-left' : 'text-right'
				)}
			>
				{value}
			</span>
		</div>
	);
}

function calculateAge(birthDateString: string): number | null {
	const birthDate = new Date(birthDateString);
	if (Number.isNaN(birthDate.getTime())) {
		return null;
	}
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

function formatDate(dateString: string, locale: Locale): string | null {
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return format(date, 'dd MMM yyyy', { locale });
}

function mapGender(value: number, options: { male: string; female: string; other: string }): string {
	switch (value) {
		case 0:
			return options.male;
		case 1:
			return options.female;
		default:
			return options.other;
	}
}

function formatRut(rut?: number | null): string | null {
	if (!rut) return null;
	const body = rut.toString();
	const reversed = body.split('').reverse();
	const withDots = reversed.reduce<string[]>((acc, digit, index) => {
		acc.push(digit);
		if ((index + 1) % 3 === 0 && index + 1 !== reversed.length) {
			acc.push('.');
		}
		return acc;
	}, []);
	const formattedBody = withDots.reverse().join('');
	return `${formattedBody}-${calculateVerificationDigit(body)}`;
}

function calculateVerificationDigit(body: string): string {
	let sum = 0;
	let multiplier = 2;
	for (let i = body.length - 1; i >= 0; i -= 1) {
		sum += Number(body[i]) * multiplier;
		multiplier = multiplier === 7 ? 2 : multiplier + 1;
	}
	const remainder = 11 - (sum % 11);
	if (remainder === 11) return '0';
	if (remainder === 10) return 'K';
	return remainder.toString();
}

function getStatusClass(state?: string): string {
	if (!state) {
		return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200';
	}
	const normalized = state.toLowerCase();
	if (normalized.includes('control') || normalized.includes('active')) {
		return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
	}
	if (normalized.includes('precauc') || normalized.includes('inact')) {
		return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
	}
	if (normalized.includes('alert')) {
		return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
	}
	if (normalized.includes('suspend')) {
		return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
	}
	return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
}
