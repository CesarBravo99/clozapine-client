// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
// 	Check,
// 	X,
// 	Clock,
// 	Calendar,
// 	User,
// 	AlertTriangle,
// 	Info,
// 	Bell,
// 	FileText,
// 	ArrowRight,
// } from 'lucide-react';
// import type { Notification } from '@/models/Notifications/Notifications';
// import {
// 	getNotificationTypeText,
// 	getNotificationColor,
// } from '../../utils/notificationUtils';
// import { initialPatients } from '@/services/test/Patients';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';
// import { useState } from 'react';
// import { CompleteTaskDialog } from './CompleteTaskDialog';

// interface NotificationDetailDialogProps {
// 	open: boolean;
// 	onOpenChange: (open: boolean) => void;
// 	notification: Notification | null;
// 	onCompleteNotification: (id: number) => void;
// 	onViewPatient?: (patientRut: number) => void;
// 	onScheduleAppointment?: (patientRut: number) => void;
// }

// export function NotificationDetailDialog({
// 	open,
// 	onOpenChange,
// 	notification,
// 	onCompleteNotification,
// 	onViewPatient,
// 	onScheduleAppointment,
// }: NotificationDetailDialogProps) {
// 	if (!notification) return null;

// 	// Get related patient information if available
// 	const patient = notification.patientRut
// 		? initialPatients.find((p) => p.patientRut === notification.patientRut)
// 		: null;

// 	// Helper to get proper notification icon based on type
// 	const getNotificationIcon = (type: string) => {
// 		switch (type) {
// 			case 'emergency':
// 				return <AlertTriangle className='h-5 w-5 text-red-500' />;
// 			case 'important':
// 				return <AlertTriangle className='h-5 w-5 text-orange-500' />;
// 			case 'reminder':
// 				return <Clock className='h-5 w-5 text-blue-500' />;
// 			case 'information':
// 				return <Info className='h-5 w-5 text-gray-500' />;
// 			case 'control':
// 				return <FileText className='h-5 w-5 text-green-500' />;
// 			case 'request':
// 				return <Bell className='h-5 w-5 text-purple-500' />;
// 			default:
// 				return <Bell className='h-5 w-5 text-gray-500' />;
// 		}
// 	};

// 	// Format date
// 	const formatDate = (dateString: string) => {
// 		try {
// 			return format(new Date(dateString), 'PPP p', { locale: es });
// 		} catch (error) {
// 			return dateString;
// 		}
// 	};

// 	const [showCompleteDialog, setShowCompleteDialog] = useState(false);

// 	return (
// 		<Dialog open={open} onOpenChange={onOpenChange}>
// 			<DialogContent className='sm:max-w-[550px]'>
// 				<DialogHeader>
// 					<div className='flex items-center gap-3'>
// 						{getNotificationIcon(notification.type)}
// 						<DialogTitle className='text-xl'>
// 							{notification.title ||
// 								getNotificationTypeText(notification.type, true)}
// 						</DialogTitle>
// 					</div>
// 					<div className='flex items-center gap-2 mt-1'>
// 						<Badge
// 							className={`bg-${
// 								notification.type === 'emergency'
// 									? 'red'
// 									: notification.type === 'important'
// 									? 'orange'
// 									: notification.type === 'reminder'
// 									? 'blue'
// 									: notification.type === 'control'
// 									? 'green'
// 									: notification.type === 'request'
// 									? 'purple'
// 									: 'gray'
// 							}-100
// 								text-${
// 									notification.type === 'emergency'
// 										? 'red'
// 										: notification.type === 'important'
// 										? 'orange'
// 										: notification.type === 'reminder'
// 										? 'blue'
// 										: notification.type === 'control'
// 										? 'green'
// 										: notification.type === 'request'
// 										? 'purple'
// 										: 'gray'
// 								}-800`}
// 						>
// 							{getNotificationTypeText(notification.type)}
// 						</Badge>

// 						{notification.isAction && (
// 							<Badge
// 								variant='outline'
// 								className='bg-blue-50 text-blue-800 border-blue-200'
// 							>
// 								Requiere acción
// 							</Badge>
// 						)}

// 						{notification.completed && (
// 							<Badge
// 								variant='outline'
// 								className='bg-green-50 text-green-800 border-green-200'
// 							>
// 								Completado
// 							</Badge>
// 						)}
// 					</div>
// 				</DialogHeader>

// 				<div className='py-4 space-y-5'>
// 					{/* Notification Details */}
// 					<div className='space-y-3'>
// 						<div className='text-sm text-gray-700 dark:text-gray-300'>
// 							<div className='flex items-center gap-2 text-xs text-gray-500 mb-2'>
// 								<Clock className='h-3.5 w-3.5' />
// 								<span>{formatDate(notification.date)}</span>
// 							</div>

// 							<p className='text-base'>{notification.content}</p>
// 						</div>

// 						{/* Form data if present */}
// 						{notification.formData &&
// 							Object.keys(notification.formData).length > 0 && (
// 								<div className='mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-md'>
// 									<h4 className='text-sm font-medium mb-2'>
// 										Datos adicionales
// 									</h4>
// 									<div className='space-y-2'>
// 										{Object.entries(notification.formData).map(
// 											([key, value]) => (
// 												<div
// 													key={key}
// 													className='grid grid-cols-3 gap-2 text-sm'
// 												>
// 													<span className='text-gray-500 font-medium'>
// 														{key}:
// 													</span>
// 													<span className='col-span-2'>
// 														{String(value)}
// 													</span>
// 												</div>
// 											)
// 										)}
// 									</div>
// 								</div>
// 							)}

// 						{/* Completion information */}
// 						{notification.completed && notification.completedBy && (
// 							<div className='mt-3 flex items-start gap-2 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md'>
// 								<Check className='h-4 w-4 text-green-500 mt-0.5' />
// 								<div>
// 									<p className='font-medium text-green-800 dark:text-green-400'>
// 										Completado
// 									</p>
// 									<p className='text-gray-600 dark:text-gray-400'>
// 										Por {notification.userName} el{' '}
// 										{notification.completedAt
// 											? formatDate(notification.completedAt)
// 											: 'fecha no disponible'}
// 									</p>
// 								</div>
// 							</div>
// 						)}
// 					</div>

// 					{/* Patient information if available */}
// 					{patient && (
// 						<>
// 							<Separator />
// 							<div className='space-y-3'>
// 								<h3 className='font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
// 									<User className='h-4 w-4' />
// 									Información del Paciente
// 								</h3>
// 								<div className='bg-gray-50 dark:bg-gray-900 p-3 rounded-md'>
// 									<div className='flex justify-between items-start'>
// 										<div>
// 											<p className='font-medium'>
// 												{patient.patientFirstName}{' '}
// 												{patient.patientLastName}
// 											</p>
// 											<p className='text-sm text-gray-500 mt-1'>
// 												RUT: {patient.patientRut}
// 											</p>

// 											{patient.patientClinicalHistory && (
// 												<div className='mt-2'>
// 													<Badge
// 														variant='outline'
// 														className={`
// 															${
// 																patient
// 																	.patientClinicalHistory
// 																	.patientState === 0
// 																	? 'bg-green-50 text-green-800 border-green-200'
// 																	: patient
// 																			.patientClinicalHistory
// 																			.patientState ===
// 																	  1
// 																	? 'bg-yellow-50 text-yellow-800 border-yellow-200'
// 																	: patient
// 																			.patientClinicalHistory
// 																			.patientState ===
// 																	  2
// 																	? 'bg-red-50 text-red-800 border-red-200'
// 																	: 'bg-gray-50 text-gray-800 border-gray-200'
// 															}
// 														`}
// 													>
// 														{patient.patientClinicalHistory
// 															.patientState === 0
// 															? 'Controlado'
// 															: patient
// 																	.patientClinicalHistory
// 																	.patientState === 1
// 															? 'Precaución'
// 															: patient
// 																	.patientClinicalHistory
// 																	.patientState === 2
// 															? 'Alerta'
// 															: 'Desconocido'}
// 													</Badge>
// 												</div>
// 											)}
// 										</div>

// 										{/* Patient actions */}
// 										<div className='flex gap-2'>
// 											{onViewPatient && (
// 												<Button
// 													variant='outline'
// 													size='sm'
// 													onClick={() =>
// 														onViewPatient(patient.patientRut)
// 													}
// 												>
// 													<FileText className='h-3.5 w-3.5 mr-1' />
// 													Ver Ficha
// 												</Button>
// 											)}

// 											{onScheduleAppointment && (
// 												<Button
// 													variant='outline'
// 													size='sm'
// 													onClick={() =>
// 														onScheduleAppointment(
// 															patient.patientRut
// 														)
// 													}
// 												>
// 													<Calendar className='h-3.5 w-3.5 mr-1' />
// 													Agendar
// 												</Button>
// 											)}
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</>
// 					)}

// 					{/* Actions */}
// 					<div className='flex justify-end gap-2 mt-4'>
// 						{notification.isRequest && !notification.completed && (
// 							<Button
// 								variant='outline'
// 								className='border-purple-200 text-purple-700 hover:bg-purple-50'
// 								onClick={() => console.log('View request details')}
// 							>
// 								<ArrowRight className='h-4 w-4 mr-1' />
// 								Ver Solicitud
// 							</Button>
// 						)}

// 						<Button variant='outline' onClick={() => onOpenChange(false)}>
// 							<X className='h-4 w-4 mr-1' />
// 							Cerrar
// 						</Button>

// 						{!notification.completed && notification.isAction && (
// 							<Button
// 								onClick={() => setShowCompleteDialog(true)}
// 								className='bg-green-600 hover:bg-green-700'
// 							>
// 								<Check className='h-4 w-4 mr-1' />
// 								Marcar como completado
// 							</Button>
// 						)}
// 					</div>
// 				</div>

// 				{/* Complete Task Dialog */}
// 				<CompleteTaskDialog
// 					open={showCompleteDialog}
// 					onOpenChange={setShowCompleteDialog}
// 					notification={notification}
// 					onCompleteTask={onCompleteNotification}
// 				/>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
