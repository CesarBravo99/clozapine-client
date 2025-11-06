import { Button } from '@/components/ui/button';
import { Bell, Calendar, FileText, Check } from 'lucide-react';
import type { Notification } from '@/domain/notification.types';
import { NotificationListItem } from './NotificationListItem';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';

interface GroupedNotification {
	patient: string | null;
	rut: string | null;
	notifications: Notification[];
}

interface GroupedNotifications {
	[date: string]: {
		[patientKey: string]: GroupedNotification;
	};
}

interface NotificationListProps {
	groupedNotifications: GroupedNotifications;
	handleViewNotificationDetails: (notification: Notification) => void;
	handleViewPatientDetails: (patientRut: number, patientName?: string) => void;
	completeNotification: (id: number) => void;
	resetFilters: () => void;
	formatDate: (dateString: string) => string;
	getNotificationColor: (type: number) => string;
	getNotificationTypeText: (type: number, isPassive?: boolean) => string;
	openAddEventDialog: (patientRut?: number) => void;
}

export function NotificationList({
	groupedNotifications,
	handleViewNotificationDetails,
	handleViewPatientDetails,
	completeNotification,
	resetFilters,
	formatDate,
	getNotificationColor,
	getNotificationTypeText,
	openAddEventDialog,
}: NotificationListProps) {
	const lang = useSelector(selectLang);

	return (
		<>
			{Object.keys(groupedNotifications).length === 0 ? (
				<div className='text-center py-12'>
					<Bell className='h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
					<h3 className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-1'>
						{langs[lang].components.notificationList.noNotifications}
					</h3>
					<p className='text-gray-500 dark:text-gray-400'>
						{langs[lang].components.notificationList.noFilteredNotifications}
					</p>
					<Button variant='outline' className='mt-4' onClick={resetFilters}>
						{langs[lang].components.notificationList.showAllNotifications}
					</Button>
				</div>
			) : (
				<div className='space-y-6'>
					{Object.entries(groupedNotifications).map(([date, patientGroups]) => (
						<div key={date}>
							<h2 className='text-base font-medium text-gray-500 dark:text-gray-400 flex items-center'>
								<Calendar className='h-3.5 w-3.5 mr-1.5' />
								{formatDate(date)}
							</h2>

							{Object.entries(patientGroups).map(([patientKey, group]) => (
								<div
									key={`${date}-${patientKey}`}
									className='mb-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden'
								>
									{/* Patient header */}
									{group.patient && group.rut && (
										<div className='px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
											<div>
												<span className='font-medium'>{group.patient}</span>

												<span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>
													(RUT: {group.rut.slice(0, -1)}-
													{group.rut.slice(-1)})
												</span>
											</div>
											<div className='flex gap-2'>
												<Button
													variant='outline'
													size='sm'
													onClick={() => {
														if (group.rut) {
															handleViewPatientDetails(
																parseInt(group.rut, 10),
																group.patient || undefined
															);
														}
													}}
													className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700'
												>
													<FileText className='h-4 w-4 mr-1' />
													{
														langs[lang].components.notificationList
															.viewProfile
													}
												</Button>
												<Button
													variant='outline'
													size='sm'
													onClick={() => {
														if (group.rut) {
															openAddEventDialog(
																parseInt(group.rut, 10)
															);
														}
													}}
													className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700'
												>
													<Calendar className='h-4 w-4 mr-1' />
													{
														langs[lang].components.notificationList
															.schedule
													}
												</Button>
											</div>
										</div>
									)}

									{/* Notifications */}
									<div className='divide-y divide-gray-100 dark:divide-gray-800'>
										{group.notifications.map((notification) => (
											<NotificationListItem
												key={notification.notificationId}
												notification={notification}
												getNotificationColor={getNotificationColor}
												getNotificationTypeText={getNotificationTypeText}
												handleViewNotificationDetails={
													handleViewNotificationDetails
												}
												completeNotification={completeNotification}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</>
	);
}
