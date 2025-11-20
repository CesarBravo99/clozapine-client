export interface ProfileModuleTranslations {
	page: {
		title: string;
		loading: string;
		noSession: string;
		error: string;
		userLabel: string;
	};
	components: {
		tabs: {
			personal: string;
			security: string;
			preferences: string;
		};
		leftSidebar: {
			sectionTitle: string;
			profile: string;
			preferences: string;
			security: string;
			changeAffiliation: string;
		};
		personalInfo: {
			title: string;
			name: string;
			rut: string;
			sex: string;
			birthDate: string;
			age: string;
			ageWithValue: string;
			accountCreated: string;
			currentHospital: string;
			noAffiliation: string;
			changeAffiliation: string;
		};
		contactInfo: {
			title: string;
			emailLabel: string;
			emailPlaceholder: string;
			phoneLabel: string;
			phonePlaceholder: string;
			save: string;
			saving: string;
		};
		preferences: {
			notificationsTitle: string;
			emailNotifications: string;
			appNotifications: string;
			save: string;
			saving: string;
			appearanceTitle: string;
			themeLabel: string;
			darkModeLabel: string;
			lightModeLabel: string;
			changeToLight: string;
			changeToDark: string;
			fontSizeLabel: string;
			fontSizes: {
				small: string;
				medium: string;
				large: string;
			};
		};
		securitySummary: {
			title: string;
			role: string;
			lastLogin: string;
			passwordChanged: string;
			accountCreated: string;
			yes: string;
			no: string;
		};
	};
	dialogs: {
		affiliationSelector: {
			title: string;
			description: string;
			confirm: string;
		};
	};
	messages: {
		contactSaved: string;
		preferencesSaved: string;
		affiliationUpdated: string;
	};
}

export const en: ProfileModuleTranslations = {
	page: {
		title: 'User Profile',
		loading: 'Loading profile information...',
		noSession: 'No active user session detected.',
		error: 'There was a problem loading your profile. Please try again later.',
		userLabel: 'RUT:',
	},
	components: {
		tabs: {
			personal: 'Personal',
			security: 'Security',
			preferences: 'Preferences',
		},
		leftSidebar: {
			sectionTitle: 'MY ACCOUNT',
			profile: 'My profile',
			preferences: 'Preferences',
			security: 'Security',
			changeAffiliation: 'Change affiliation',
		},
		personalInfo: {
			title: 'Personal Information',
			name: 'Full name',
			rut: 'RUT',
			sex: 'Sex',
			birthDate: 'Birth date',
			age: 'Age',
			ageWithValue: '{value} years',
			accountCreated: 'Account created',
			currentHospital: 'Current hospital',
			noAffiliation: 'No affiliation selected',
			changeAffiliation: 'Change',
		},
		contactInfo: {
			title: 'Contact Information',
			emailLabel: 'Email address',
			emailPlaceholder: 'name@example.com',
			phoneLabel: 'Phone number',
			phonePlaceholder: '+56 9 1234 5678',
			save: 'Save changes',
			saving: 'Saving...',
		},
		preferences: {
			notificationsTitle: 'Notifications',
			emailNotifications: 'Email notifications',
			appNotifications: 'In-app notifications',
			save: 'Save preferences',
			saving: 'Saving...',
			appearanceTitle: 'Appearance',
			themeLabel: 'Theme',
			darkModeLabel: 'Dark mode',
			lightModeLabel: 'Light mode',
			changeToLight: 'Switch to light',
			changeToDark: 'Switch to dark',
			fontSizeLabel: 'Text size',
			fontSizes: {
				small: 'Small',
				medium: 'Medium',
				large: 'Large',
			},
		},
		securitySummary: {
			title: 'Security Information',
			role: 'Role',
			lastLogin: 'Last login',
			passwordChanged: 'Password changed',
			accountCreated: 'Account created',
			yes: 'Yes',
			no: 'No',
		},
	},
	dialogs: {
		affiliationSelector: {
			title: 'Select hospital',
			description: 'Choose the affiliation you want to work with.',
			confirm: 'Confirm selection',
		},
	},
	messages: {
		contactSaved: 'Contact information updated successfully',
		preferencesSaved: 'Preferences saved successfully',
		affiliationUpdated: 'Affiliation updated successfully',
	},
};

