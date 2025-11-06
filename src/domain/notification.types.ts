export interface Notification {
	// Server information
	readonly notificationId: number;
	readonly affiliationId: number;
	readonly userRut: number | null;
	readonly userName: string | null;
	readonly patientRut: number | null;
	readonly patientName: string | null;
	readonly date: string;
	readonly category: NotificationCategory;
	readonly type: NotificationType;
	readonly metadata: NotificationMetadata;

	// Front end use
	readonly title: string | null;
	readonly content: string | null;
	// readonly isAction: boolean; depends on category
	// readonly isRequest: boolean; depends on category
	// readonly requestType: string; depends on category
}

export enum NotificationCategory {
	MinsalIndication = 0,
	MinsalSuggestion = 1,
	Information = 2,
	AffiliationChange = 3,
}

export enum NotificationType {
	Urgency = 0,
	Important = 1,
	Suggestion = 2,
	Normal = 3,
	Request = 4,
}

export interface NotificationMetadata {
	readonly taskCompleted: boolean;
	readonly completedBy: number | null;
	readonly completedAt: string | null;
	readonly details: NotificationDetails;
}

export interface NotificationDetails {
	readonly affiliationRequest: boolean;
	readonly newAffiliationId: number | null;
	readonly oldAffiliationId: number | null;
}

export interface GroupedNotifications {
	[date: string]: {
		[patientKey: string]: {
			affiliationId: number;
			affiliationName: string | null;
			patientName: string | null;
			patientRut: number | null;
			notifications: Notification[];
		};
	};
}
