export type ServerAffiliation = {
	affiliationId: number;
	affiliationName: string;
	affiliationShortName: string;
	supportPhone: string;
	supportEmail: string;
	affiliationSettings: ServerAffiliationSettings;
	paidStatus: boolean;
};

export type ServerAffiliationSettings = {
	readonly affiliationId: number;
	readonly workDaySettings: {
		readonly workDayStart: string;
		readonly workDayEnd: string;
	};
	readonly appointmentSettings: {
		readonly appointmentDuration: number;
		readonly allowWeekendAppointments: boolean;
	};
	readonly passwordRequirements: {
		readonly minLength: number;
		readonly specialCharacters: boolean;
		readonly requireNumbers: boolean;
		readonly requireUppercase: boolean;
		readonly expirationEnabled: boolean;
		readonly expirationDays: number;
	};
	readonly showAffiliationLogo: boolean;
	readonly showUserLogs: boolean;
};
