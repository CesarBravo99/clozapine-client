export { getNotificationsByUser } from './notification';

// Export types
export type { GroupedNotification, GroupedNotifications } from './types/notification.types';

// Export adapter functions
export {
	formatNotificationDate,
	getNotificationColor,
	getNotificationTypeText,
	groupNotificationsByDateAndPatient,
	filterNotificationsByCompletion,
	getPendingNotificationCount,
	sortNotificationsByDateAndPriority,
} from './adapters/notification.adapter';
