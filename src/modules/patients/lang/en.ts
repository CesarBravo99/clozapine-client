export const en = {
	patients: {
		title: 'Patients',
		affiliationLabel: 'Affiliation:',
		loadingText: 'Loading patients...',
		errorMessage: 'Failed to load patients. Please try again.',
		noAffiliationSelected:
			'No affiliation selected. Please select an affiliation to view patients.',
		noFilteredPatients: 'No patients match the selected filter.',
		refreshButton: 'Refresh',
		refreshingButton: 'Refreshing...',
		filterCount: '{filtered} of {total}',
		tableColumns: {
			name: 'Name',
			rut: 'RUT',
			age: 'Age',
			state: 'State',
			lastControl: 'Last Control',
		},
		states: {
			all: 'All',
			active: 'Active',
			inactive: 'Inactive',
			suspended: 'Suspended',
			affiliationInactive: 'Inactive Affiliation',
		},
		empty: {
			title: 'No patients',
			description: 'No patients found to display.',
		},
	},
	components: {
		leftSidebar: {
			quickActions: 'QUICK ACTIONS',
			addPatient: 'Add Patient',
			filterByState: 'Filter by State',
		},
		patientsTable: {
			search: 'Search patients...',
			noResults: 'No patients found',
			loading: 'Loading...',
			rowsPerPage: 'Rows per page',
			page: 'Page',
			of: 'of',
			previous: 'Previous',
			next: 'Next',
			actions: 'Actions',
			viewDetails: 'View Details',
			editPatient: 'Edit Patient',
		},
		filter: {
			clearFilters: 'Clear filters',
			applyFilters: 'Apply filters',
		},
	},
};

export type PatientsLanguages = typeof en;
