import type { Notification } from '@/domain/notification.types';
import type { LanguageState } from '@/redux/settings/settings.types';
import type { GroupedNotification, GroupedNotifications } from '../types/notification.types';
import { langs } from '@/modules/notifications/lang';

/**
 * Formats a date string to a localized readable format
 */
export const formatNotificationDate = (dateString: string, language: LanguageState): string => {
	if (!dateString) return 'Invalid date';

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return dateString;
		}

		return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	} catch (error) {
		console.warn('Error formatting notification date:', error);
		return dateString;
	}
};

/**
 * Maps notification type to corresponding color class
 */
export const getNotificationColor = (type: number): string => {
	const colorMap: Record<number, string> = {
		0: 'bg-red-500', // Urgency
		1: 'bg-orange-500', // Important
		2: 'bg-yellow-500', // Suggestion
		3: 'bg-blue-500', // Normal
		4: 'bg-purple-500', // Request
	};
	return colorMap[type] || 'bg-gray-500';
};

/**
 * Maps notification type to localized text
 */
export const getNotificationTypeText = (
	type: number,
	language: LanguageState,
	isPassive?: boolean
): string => {
	const typeMap: Record<number, string> = {
		0: isPassive
			? langs[language].components.rightSidebar.urgent
			: langs[language].components.rightSidebar.urgent,
		1: isPassive
			? langs[language].components.rightSidebar.important
			: langs[language].components.rightSidebar.important,
		2: isPassive
			? langs[language].components.rightSidebar.reminder
			: langs[language].components.rightSidebar.reminder,
		3: isPassive
			? langs[language].components.rightSidebar.normal
			: langs[language].components.rightSidebar.normal,
		4: isPassive
			? langs[language].components.rightSidebar.requests
			: langs[language].components.rightSidebar.requests,
	};
	return typeMap[type] || 'Unknown';
};

/**
 * Groups notifications by date and patient for organized display
 */
export const groupNotificationsByDateAndPatient = (
	notifications: Notification[]
): GroupedNotifications => {
	if (!Array.isArray(notifications)) {
		console.warn('Expected array of notifications, got:', typeof notifications);
		return {};
	}

	return notifications.reduce((groups, notification) => {
		if (!notification) return groups;

		try {
			const date = new Date(notification.date).toISOString().split('T')[0];
			const patientKey = notification.patientRut
				? `${notification.patientRut}-${notification.patientName || 'Unknown'}`
				: 'no-patient';

			if (!groups[date]) {
				groups[date] = {};
			}

			if (!groups[date][patientKey]) {
				groups[date][patientKey] = {
					patient: notification.patientName,
					rut: notification.patientRut ? notification.patientRut.toString() : null,
					notifications: [],
				};
			}

			groups[date][patientKey].notifications.push(notification);
			return groups;
		} catch (error) {
			console.error('Error grouping notification:', error, notification);
			return groups;
		}
	}, {} as GroupedNotifications);
};

/**
 * Filters notifications based on completion status
 */
export const filterNotificationsByCompletion = (
	notifications: Notification[],
	showCompleted: boolean = true
): Notification[] => {
	if (!Array.isArray(notifications)) {
		return [];
	}

	if (showCompleted) {
		return notifications;
	}

	return notifications.filter(
		(notification) => notification && !notification.metadata?.taskCompleted
	);
};

/**
 * Gets the count of pending (incomplete) notifications
 */
export const getPendingNotificationCount = (notifications: Notification[]): number => {
	if (!Array.isArray(notifications)) {
		return 0;
	}

	return notifications.filter(
		(notification) => notification && !notification.metadata?.taskCompleted
	).length;
};

/**
 * Sorts notifications by date and priority
 */
export const sortNotificationsByDateAndPriority = (
	notifications: Notification[]
): Notification[] => {
	if (!Array.isArray(notifications)) {
		return [];
	}

	return [...notifications].sort((a, b) => {
		// First sort by date (newest first)
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();

		if (dateB !== dateA) {
			return dateB - dateA;
		}

		// Then sort by priority (urgent/important first)
		return a.type - b.type;
	});
};
