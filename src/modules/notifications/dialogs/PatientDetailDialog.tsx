import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Check, X } from 'lucide-react';
import type { Notification } from '@/domain/notification.types';
import type { NotificationPatientSummary } from '../context/NotificationContext';
import { getNotificationColor, getNotificationTypeText } from '@/api/notifications';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { useMemo } from 'react';
import { langs } from '@/modules/notifications/lang';

interface PatientDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	patient: NotificationPatientSummary | null;
	patientNotifications: Notification[];
	onScheduleAppointment: () => void;
}

const getInitials = (name: string | null) => {
	if (!name) return 'NA';
	const parts = name.split(' ').filter(Boolean);
	if (parts.length === 0) return 'NA';
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export function PatientDetailDialog({
	open,
	onOpenChange,
	patient,
	patientNotifications,
	onScheduleAppointment,
}: PatientDetailDialogProps) {
	const lang = useSelector(selectLang);
	const dictionary = langs[lang].dialogs.patientDetail;

	const notificationsPreview = useMemo(() => {
		return patientNotifications
			.filter((notification) => notification.patientRut === patient?.patientRut)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 3);
	}, [patientNotifications, patient]);

	if (!patient) {
		return null;
	}

	const fallbackName = patient.fullName ?? dictionary.fallbackName;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>{dictionary.title}</DialogTitle>
					<DialogDescription>{dictionary.description}</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-2'>
					<section className='flex items-start gap-4'>
						<Avatar className='h-16 w-16 text-lg'>
							<AvatarFallback className='bg-blue-100 text-blue-700'>
								{getInitials(fallbackName)}
							</AvatarFallback>
						</Avatar>

						<div className='flex-1 space-y-2'>
							<div>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-50'>
									{fallbackName}
								</h3>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{dictionary.rutLabel}{' '}
									{patient.rutFormatted ?? dictionary.noRut}
								</p>
							</div>

							<div className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
								<div className='rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900'>
									<p className='text-xs uppercase text-gray-500'>
										{dictionary.lastControl}
									</p>
									<p className='mt-1 font-medium text-gray-800 dark:text-gray-200'>
										{patient.lastControl ?? dictionary.lastControlFallback}
									</p>
								</div>
								<div className='rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900'>
									<p className='text-xs uppercase text-gray-500'>
										{dictionary.status}
									</p>
									<p className='mt-1 font-medium text-gray-800 dark:text-gray-200'>
										{patient.state ?? dictionary.statusFallback}
									</p>
								</div>
							</div>

							{patient.raw?.rawData?.userRut && (
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									{dictionary.assignationLabel.replace(
										'{rut}',
										String(patient.raw.rawData.userRut)
									)}
								</p>
							)}
						</div>
					</section>

					<div className='h-px bg-gray-200 dark:bg-gray-800' />

					<section className='space-y-3'>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>
								{dictionary.recentNotifications}
							</h3>
							<span className='text-xs text-gray-400'>
								{dictionary.recentNotificationsCount.replace(
									'{count}',
									String(notificationsPreview.length)
								)}
							</span>
						</div>

						{notificationsPreview.length === 0 && (
							<p className='rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400'>
								{dictionary.noRecentNotifications}
							</p>
						)}

						<div className='space-y-3'>
							{notificationsPreview.map((notification) => (
								<div
									key={notification.notificationId}
									className='rounded-lg border border-gray-100 p-3 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900'
								>
									<div className='flex items-center justify-between gap-2'>
										<div className='flex items-center gap-2'>
											<span
												className={`h-2.5 w-2.5 rounded-full ${getNotificationColor(
													notification.type
												)}`}
											></span>
											<p className='font-medium text-gray-700 dark:text-gray-200'>
												{getNotificationTypeText(notification.type, lang, true)}
											</p>
										</div>
										<span className='text-xs text-gray-400'>
											{new Date(notification.date).toLocaleDateString(
												lang === 'es' ? 'es-ES' : 'en-US'
											)}
										</span>
									</div>
									<p className='mt-2 text-gray-600 dark:text-gray-300'>
										{notification.content || langs[lang].components.notificationListItem.noDetails}
									</p>

									{notification.metadata?.taskCompleted && (
										<div className='mt-2 flex items-center gap-2 rounded-md bg-green-50 p-2 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-300'>
											<Check className='h-3.5 w-3.5' />
											<span>
												{notification.metadata.completedAt
													? dictionary.completedAt.replace(
															'{date}',
															new Date(
																notification.metadata.completedAt
															).toLocaleDateString(
																lang === 'es' ? 'es-ES' : 'en-US'
															)
													  )
													: dictionary.completedWithoutDate}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				</div>

				<DialogFooter className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						<X className='mr-2 h-4 w-4' />
						{dictionary.close}
					</Button>
					<Button onClick={onScheduleAppointment}>
						<Calendar className='mr-2 h-4 w-4' />
						{dictionary.schedule}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

