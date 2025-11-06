export const en = {
	prescriptions: {
		title: 'Prescriptions',
		userLabel: 'User:',
		loadingText: 'Loading prescriptions...',
		errorMessage: 'Failed to load prescriptions. Please try again.',
		noUserSelected: 'No user selected. Please select a user to view prescriptions.',
		noFilteredPrescriptions: 'No prescriptions match the selected filter.',
		refreshButton: 'Refresh',
		refreshingButton: 'Refreshing...',
		filterCount: '{filtered} of {total}',
		tableColumns: {
			patient: 'Patient',
			medication: 'Medication',
			date: 'Date',
			status: 'Status',
		},
		statuses: {
			all: 'All',
			active: 'Active',
			suspended: 'Suspended',
			completed: 'Completed',
		},
		empty: {
			title: 'No prescriptions',
			description: 'No prescriptions found to display.',
		},
	},
	components: {
		leftSidebar: {
			quickActions: 'QUICK ACTIONS',
			addPrescription: 'Add Prescription',
			filterByStatus: 'Filter by Status',
		},
		prescriptionsTable: {
			search: 'Search prescriptions...',
			noResults: 'No prescriptions found',
			loading: 'Loading...',
			rowsPerPage: 'Rows per page',
			page: 'Page',
			of: 'of',
			previous: 'Previous',
			next: 'Next',
			actions: 'Actions',
			viewDetails: 'View Details',
			editPrescription: 'Edit Prescription',
		},
		filter: {
			clearFilters: 'Clear filters',
			applyFilters: 'Apply filters',
		},
	},
};

export type PrescriptionsLanguages = typeof en;
