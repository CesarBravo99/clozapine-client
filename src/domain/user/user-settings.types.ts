export interface UserSettings {
	readonly userSettingsId: number;
	readonly userRut: number;
	readonly userTheme: UserTheme;
	readonly userLanguage: UserLanguage;
	readonly userFontSize: UserFontSize;
	readonly userTimezone: UserTimezone;
	readonly emailNotifications: UserEmailNotifications;
	readonly whatsappNotifications: UserWhatsappNotifications;
	readonly onlyOneSessionPerDevice: UserOnlyOneSessionAllowed;
	readonly showProfilePicture: UserShowProfilePicture;
}

export enum UserTheme {
	Light = 'light',
	Dark = 'dark',
}

export enum UserFontSize {
	Small = 12,
	Medium = 16,
	Large = 20,
}

export enum UserEmailNotifications {
	Enabled = 1,
	Disabled = 0,
}

export enum UserOnlyOneSessionAllowed {
	Enabled = 1,
	Disabled = 0,
}

export enum UserShowProfilePicture {
	Enabled = 1,
	Disabled = 0,
}

export enum UserLanguage {
	English = 'en',
	Spanish = 'es',
}

export enum UserTimezone {
	UTC = 'UTC',
	AmericaNewYork = 'America/New_York',
	AmericaLosAngeles = 'America/Los_Angeles',
	AmericaChicago = 'America/Chicago',
}

export enum UserWhatsappNotifications {
	Enabled = 1,
	Disabled = 0,
}
