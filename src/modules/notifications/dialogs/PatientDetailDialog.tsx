// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogDescription,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { FileText, Calendar, Folder, Check } from 'lucide-react';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import type { Patient } from '@/models/Patient/Patient';
// import type { Notification } from '@/models/Notifications/Notifications';
// import { calculateAge } from '@/utils/patientListUtils';
// import { useNotifications } from '@/hooks/use-notifications';
// import {
// 	getNotificationTypeText,
// 	getNotificationColor,
// } from '../../utils/notificationUtils';

// interface PatientDetailDialogProps {
// 	open: boolean;
// 	onOpenChange: (open: boolean) => void;
// 	patient: Patient | null;
// 	onScheduleAppointment: () => void;
// }

// export function PatientDetailDialog({
// 	open,
// 	onOpenChange,
// 	patient,
// 	onScheduleAppointment,
// }: PatientDetailDialogProps) {
// 	if (!patient) return null;

// 	// Get notifications
// 	const { notifications } = useNotifications();

// 	// Filter notifications for this patient
// 	const patientNotifications = notifications
// 		.filter((n) => n.patientRut === patient.patientRut)
// 		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
// 		.slice(0, 2); // Get most recent 2

// 	// Function to get status badge
// 	const getStatusBadge = (status: string) => {
// 		let color = '';

// 		switch (status.toLowerCase()) {
// 			case 'controlado':
// 			case 'stable':
// 			case '0':
// 				color =
// 					'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
// 				break;
// 			case 'precaución':
// 			case 'caution':
// 			case '1':
// 				color =
// 					'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
// 				break;
// 			case 'alerta':
// 			case 'alert':
// 			case '2':
// 				color =
// 					'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
// 				break;
// 			case 'suspendido':
// 			case 'suspended':
// 				color = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
// 				break;
// 			default:
// 				color = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
// 		}

// 		const statusLabel = typeof status === 'string' ? status : String(status);

// 		return (
// 			<div
// 				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
// 			>
// 				<span
// 					className={`w-2 h-2 rounded-full mr-1.5 bg-${
// 						statusLabel === '0'
// 							? 'green'
// 							: statusLabel === '1'
// 							? 'yellow'
// 							: statusLabel === '2'
// 							? 'orange'
// 							: 'gray'
// 					}-500`}
// 				></span>
// 				{statusLabel === '0'
// 					? 'Controlado'
// 					: statusLabel === '1'
// 					? 'Precaución'
// 					: statusLabel === '2'
// 					? 'Alerta'
// 					: statusLabel}
// 			</div>
// 		);
// 	};

// 	return (
// 		<Dialog open={open} onOpenChange={onOpenChange}>
// 			<DialogContent className='sm:max-w-[600px] dark:border-gray-700'>
// 				<DialogHeader>
// 					<div className='flex items-center justify-between'>
// 						<DialogTitle className='text-xl text-gray-900 dark:text-white'>
// 							Detalles del Paciente
// 						</DialogTitle>
// 					</div>
// 					<DialogDescription className='text-gray-500 dark:text-gray-400'>
// 						Información rápida del paciente
// 					</DialogDescription>
// 				</DialogHeader>

// 				<div className='py-4'>
// 					<div className='flex items-start gap-4 mb-6'>
// 						<Avatar className='h-16 w-16'>
// 							<AvatarFallback className='bg-blue-100 text-blue-800 text-xl'>
// 								{`${patient.patientFirstName.charAt(
// 									0
// 								)}${patient.patientLastName.charAt(0)}`}
// 							</AvatarFallback>
// 						</Avatar>
// 						<div>
// 							<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
// 								{patient.patientFirstName} {patient.patientLastName}
// 							</h3>
// 							<p className='text-sm text-gray-500 dark:text-gray-400'>
// 								RUT: {patient.patientRut}
// 							</p>
// 							<div className='mt-2'>
// 								{getStatusBadge(
// 									String(
// 										patient.patientClinicalHistory?.patientState || ''
// 									)
// 								)}
// 							</div>
// 						</div>
// 					</div>

// 					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
// 						<div className='space-y-2'>
// 							<h4 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
// 								Información Personal
// 							</h4>
// 							<div className='bg-gray-50 dark:bg-gray-800 p-3 rounded-md'>
// 								<div className='grid grid-cols-2 gap-2'>
// 									<div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
// 										Edad:
// 									</div>
// 									<div className='text-sm text-gray-900 dark:text-gray-100'>
// 										{calculateAge(patient.patientBirthday)} años
// 									</div>
// 									<div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
// 										Fecha de nacimiento:
// 									</div>
// 									<div className='text-sm text-gray-900 dark:text-gray-100'>
// 										{new Date(
// 											patient.patientBirthday
// 										).toLocaleDateString('es-ES')}
// 									</div>
// 									<div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
// 										Centro Médico:
// 									</div>
// 									<div className='text-sm text-gray-900 dark:text-gray-100'>
// 										{patient.mainAffiliation?.affiliationName ||
// 											'No asignado'}
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						<div className='space-y-2'>
// 							<h4 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
// 								Datos Médicos
// 							</h4>
// 							<div className='bg-gray-50 dark:bg-gray-800 p-3 rounded-md'>
// 								<div className='grid grid-cols-2 gap-2'>
// 									<div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
// 										Último control:
// 									</div>
// 									<div className='text-sm text-gray-900 dark:text-gray-100'>
// 										{patient.patientClinicalHistory?.lastCheckupDate
// 											? new Date(
// 													patient.patientClinicalHistory?.lastCheckupDate
// 											  ).toLocaleDateString('es-ES')
// 											: 'No disponible'}
// 									</div>
// 									<div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
// 										Próximo control:
// 									</div>
// 									<div className='text-sm text-gray-900 dark:text-gray-100'>
// 										{patient.patientClinicalHistory?.nextCheckupDate
// 											? new Date(
// 													patient.patientClinicalHistory?.nextCheckupDate
// 											  ).toLocaleDateString('es-ES')
// 											: 'No programado'}
// 									</div>
// 								</div>

// 								{/* Medication section integrated within medical data */}
// 								{patient.patientCurrentMedication &&
// 									patient.patientCurrentMedication.length > 0 && (
// 										<>
// 											<div className='text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 mb-1'>
// 												Medicación:
// 											</div>
// 											<ul className='space-y-1'>
// 												{patient.patientCurrentMedication.map(
// 													(med, index) => (
// 														<li
// 															key={index}
// 															className='flex items-center text-sm'
// 														>
// 															<Check className='h-3 w-3 text-blue-500 mr-2' />
// 															{med}
// 														</li>
// 													)
// 												)}
// 											</ul>
// 										</>
// 									)}
// 							</div>
// 						</div>
// 					</div>

// 					{/* Latest Notifications Section */}
// 					{patientNotifications.length > 0 && (
// 						<div className='mb-6'>
// 							<h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
// 								Últimas Notificaciones
// 							</h4>
// 							<div className='space-y-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md'>
// 								{patientNotifications.map((notification) => (
// 									<div
// 										key={notification.notificationId}
// 										className='border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0'
// 									>
// 										<div className='flex items-center justify-between mb-2'>
// 											<div className='flex items-center'>
// 												<span
// 													className={`w-2.5 h-2.5 rounded-full mr-2 ${getNotificationColor(
// 														notification.type
// 													)}`}
// 												></span>
// 												<span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
// 													{getNotificationTypeText(
// 														notification.type,
// 														!notification.isAction
// 													)}
// 												</span>
// 											</div>
// 											<span className='text-xs text-gray-500 dark:text-gray-400'>
// 												{new Date(
// 													notification.date
// 												).toLocaleDateString('es-ES')}
// 											</span>
// 										</div>
// 										<p className='text-sm text-gray-800 dark:text-gray-200'>
// 											{notification.content}
// 										</p>
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					)}

// 					<div className='flex flex-wrap gap-2 justify-end'>
// 						<Button
// 							variant='outline'
// 							className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/20'
// 							onClick={() => console.log('View exams')}
// 						>
// 							<Folder className='h-4 w-4 mr-2' />
// 							Exámenes
// 						</Button>
// 						<Button
// 							variant='outline'
// 							className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/20'
// 							onClick={() => console.log('View full record')}
// 						>
// 							<FileText className='h-4 w-4 mr-2' />
// 							Ver ficha completa
// 						</Button>
// 						<Button
// 							className='bg-blue-500 hover:bg-blue-600 text-white'
// 							onClick={onScheduleAppointment}
// 						>
// 							<Calendar className='h-4 w-4 mr-2' />
// 							Agendar cita
// 						</Button>
// 					</div>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
