export interface ConfigModuleTranslations {
	page: {
		title: string;
		searchPlaceholder: string;
		addPersonnel: string;
	};
	tabs: {
		security: string;
		users: string;
		hospital: string;
	};
	components: {
		leftSidebar: {
			title: string;
			security: string;
			users: string;
			hospital: string;
		};
		securitySettings: {
			title: string;
			twoFactorLabel: string;
			twoFactorDescription: string;
			autoLockLabel: string;
			autoLockDescription: string;
			timeoutLabel: string;
			loginAlertsLabel: string;
			loginAlertsDescription: string;
			save: string;
		};
		passwordPolicies: {
			title: string;
			expiryLabel: string;
			minLengthLabel: string;
			save: string;
		};
		personnelList: {
			empty: string;
			emailLabel: string;
			rutLabel: string;
			reset: string;
			edit: string;
			delete: string;
			status: {
				active: string;
				inactive: string;
				pending: string;
			};
		};
		affiliationSettings: {
			infoTitle: string;
			nameLabel: string;
			emailLabel: string;
			phoneLabel: string;
			addressLabel: string;
			saveInfo: string;
			calendarTitle: string;
			allowWeekendLabel: string;
			allowWeekendDescription: string;
			saveCalendar: string;
		};
	};
	dialogs: {
		addPersonnel: {
			title: string;
			description: string;
			cancel: string;
			confirm: string;
		};
		editPersonnel: {
			title: string;
			description: string;
			cancel: string;
			confirm: string;
		};
		deletePersonnel: {
			title: string;
			description: string;
			cancel: string;
			confirm: string;
		};
		resetPassword: {
			title: string;
			description: string;
			cancel: string;
			confirm: string;
		};
		form: {
			name: string;
			role: string;
			status: string;
			rut: string;
			email: string;
			phone: string;
			roleOptions: {
				doctor: string;
				nurse: string;
				receptionist: string;
				admin: string;
			};
			statusOptions: {
				active: string;
				inactive: string;
				pending: string;
			};
		};
	};
	messages: {
		securitySaved: string;
		passwordPolicySaved: string;
		affiliationSaved: string;
		personnelAdded: string;
		personnelUpdated: string;
		personnelDeleted: string;
		passwordReset: string;
	};
}

export const en: ConfigModuleTranslations = {
	page: {
		title: 'Configuration',
		searchPlaceholder: 'Search staff by name, role or email…',
		addPersonnel: 'Add staff member',
	},
	tabs: {
		security: 'Security',
		users: 'Personnel',
		hospital: 'Hospital',
	},
	components: {
		leftSidebar: {
			title: 'CONFIGURATION',
			security: 'Security',
			users: 'Personnel',
			hospital: 'Medical Center',
		},
		securitySettings: {
			title: 'Security Settings',
			twoFactorLabel: 'Two-factor authentication',
			twoFactorDescription: 'Require 2FA for every user login',
			autoLockLabel: 'Automatic lock',
			autoLockDescription: 'Lock the session after inactivity',
			timeoutLabel: 'Inactivity timeout (minutes)',
			loginAlertsLabel: 'Login alerts',
			loginAlertsDescription: 'Notify accesses from unfamiliar devices',
			save: 'Save security settings',
		},
		passwordPolicies: {
			title: 'Password Policies',
			expiryLabel: 'Password expiry',
			minLengthLabel: 'Minimum password length',
			save: 'Save policies',
		},
		personnelList: {
			empty: 'No staff members found',
			emailLabel: 'Email',
			rutLabel: 'RUT',
			reset: 'Password',
			edit: 'Edit',
			delete: 'Remove',
			status: {
				active: 'Active',
				inactive: 'Inactive',
				pending: 'Pending',
			},
		},
		affiliationSettings: {
			infoTitle: 'Medical Center Information',
			nameLabel: 'Hospital name',
			emailLabel: 'Contact email',
			phoneLabel: 'Contact phone',
			addressLabel: 'Address',
			saveInfo: 'Save information',
			calendarTitle: 'Calendar Settings',
			allowWeekendLabel: 'Allow weekend appointments',
			allowWeekendDescription: 'Enable scheduling on Saturdays and Sundays',
			saveCalendar: 'Save calendar settings',
		},
	},
	dialogs: {
		addPersonnel: {
			title: 'Add Staff Member',
			description: 'Complete the information to register a new staff member.',
			cancel: 'Cancel',
			confirm: 'Add staff',
		},
		editPersonnel: {
			title: 'Edit Staff Member',
			description: 'Update the information for this staff member.',
			cancel: 'Cancel',
			confirm: 'Save changes',
		},
		deletePersonnel: {
			title: 'Remove Staff Member',
			description: 'This action will revoke access for the selected staff member.',
			cancel: 'Cancel',
			confirm: 'Remove',
		},
		resetPassword: {
			title: 'Reset Password',
			description: 'Send a temporary password to the selected staff member.',
			cancel: 'Cancel',
			confirm: 'Send reset link',
		},
		form: {
			name: 'Full name',
			role: 'Role',
			status: 'Status',
			rut: 'RUT',
			email: 'Email',
			phone: 'Phone',
			roleOptions: {
				doctor: 'Doctor',
				nurse: 'Nurse',
				receptionist: 'Receptionist',
				admin: 'Administrator',
			},
			statusOptions: {
				active: 'Active',
				inactive: 'Inactive',
				pending: 'Pending',
			},
		},
	},
	messages: {
		securitySaved: 'Security settings updated successfully',
		passwordPolicySaved: 'Password policies updated successfully',
		affiliationSaved: 'Hospital information saved successfully',
		personnelAdded: 'Staff member added successfully',
		personnelUpdated: 'Staff member updated successfully',
		personnelDeleted: 'Staff member removed successfully',
		passwordReset: 'Reset instructions sent successfully',
	},
};

