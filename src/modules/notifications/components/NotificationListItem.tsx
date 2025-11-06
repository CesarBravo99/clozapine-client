import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';
import type { Notification } from '@/domain/notification.types';
import { CompleteTaskDialog } from '../dialogs/CompleteTaskDialog';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';

interface NotificationListItemProps {
	notification: Notification;
	getNotificationColor: (type: number) => string;
	getNotificationTypeText: (type: number, isPassive?: boolean) => string;
	handleViewNotificationDetails: (notification: Notification) => void;
	completeNotification: (id: number, notes?: string) => void;
}

export function NotificationListItem({
	notification,
	getNotificationColor,
	getNotificationTypeText,
	handleViewNotificationDetails,
	completeNotification,
}: NotificationListItemProps) {
	const [showCompleteDialog, setShowCompleteDialog] = useState(false);
	const lang = useSelector(selectLang);

	return (
		<>
			<div
				key={notification.notificationId}
				className={`p-6 ${
					notification.metadata.taskCompleted ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''
				}`}
			>
				<div
					className='cursor-pointer'
					onClick={() => handleViewNotificationDetails(notification)}
				>
					<div className='flex items-center gap-2 mb-2'>
						<div
							className={`w-2 h-2 rounded-full ${getNotificationColor(
								notification.type
							)}`}
						></div>
						<span className='text-sm font-medium'>
							{getNotificationTypeText(notification.type, true)}
						</span>
						<div className='flex-grow'></div>
						{/* notification.isAction */}
						{!notification.metadata.taskCompleted && (
							<Button
								variant='outline'
								size='sm'
								onClick={(e) => {
									e.stopPropagation();
									setShowCompleteDialog(true);
								}}
								className='text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700'
							>
								{langs[lang].components.notificationListItem.complete}
							</Button>
						)}
					</div>

					<p
						className={`mb-2 ${
							notification.metadata.taskCompleted
								? 'text-gray-500 dark:text-gray-400'
								: ''
						}`}
					>
						{notification.content}
					</p>

					{notification.metadata.taskCompleted && (
						<div className='mt-2 text-xs text-gray-500 dark:text-gray-400 italic flex items-center justify-end'>
							<Check className='h-3.5 w-3.5 mr-1.5 text-green-500' />
							<span>
								{notification.metadata.completedBy
									? (() => {
											const completedText =
												langs[lang].components.notificationListItem
													.completedBy;
											const dateStr = new Date(
												notification.metadata.completedAt || ''
											).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US');
											return completedText
												.replace(
													'{name}',
													String(notification.metadata.completedBy)
												)
												.replace('{date}', dateStr);
										})()
									: langs[lang].components.notificationListItem.completed}
							</span>
						</div>
					)}
				</div>
			</div>

			<CompleteTaskDialog
				open={showCompleteDialog}
				onOpenChange={setShowCompleteDialog}
				notification={notification}
				onCompleteTask={completeNotification}
			/>
		</>
	);
}
