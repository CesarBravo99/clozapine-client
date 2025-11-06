import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Notification } from '@/domain/notification.types';
import { useMediaQuery } from '@/hooks/use-media-query';

interface NotificationContextType {
	// Filter state
	selectedDate: string;
	setSelectedDate: (date: string) => void;
	filterByRut: boolean;
	setFilterByRut: (value: boolean) => void;
	rutFilter: string;
	setRutFilter: (value: string) => void;
	showPendingOnly: boolean;
	setShowPendingOnly: (value: boolean) => void;
	selectedType: string;
	setSelectedType: (type: string) => void;

	// Notifications data
	notifications: Notification[];
	filteredNotifications: Notification[];

	// UI state
	sidebarCollapsed: boolean;
	setSidebarCollapsed: (value: boolean) => void;
	isExtraSmallScreen: boolean;

	// Actions
	resetFilters: () => void;
	handleRutChange: (value: string) => void;

	// Notification actions
	handleViewNotificationDetails: (notification: Notification) => void;
	handleViewPatientDetails: (patientRut: number, patientName?: string) => void;
	completeNotification: (id: number, notes?: string) => void;
	openAddEventDialog: (patientRut?: number) => void;

	// Left sidebar actions
	handleAddPatient: () => void;
	handleSearchPatient: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
	children: ReactNode;
	notifications: Notification[];
}

export function NotificationProvider({ children, notifications }: NotificationProviderProps) {
	// Filter state
	const [selectedDate, setSelectedDate] = useState('');
	const [filterByRut, setFilterByRut] = useState(false);
	const [rutFilter, setRutFilter] = useState('');
	const [showPendingOnly, setShowPendingOnly] = useState(false);
	const [selectedType, setSelectedType] = useState('all');

	// UI state
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const isExtraSmallScreen = useMediaQuery('(max-width: 640px)');

	// Filter notifications based on current filters
	const filteredNotifications = notifications.filter((notification) => {
		// Date filter
		if (selectedDate) {
			const notificationDate = new Date(notification.date).toISOString().split('T')[0];
			if (notificationDate !== selectedDate) return false;
		}

		// RUT filter
		if (filterByRut && rutFilter) {
			const cleanRut = rutFilter.replace(/[.-]/g, '');
			const notificationRut = String(notification.userRut).replace(/[.-]/g, '');
			if (!notificationRut.includes(cleanRut)) return false;
		}

		// Pending filter
		if (showPendingOnly && notification.metadata.taskCompleted) {
			return false;
		}

		// Type filter
		if (selectedType !== 'all') {
			const typeMap: Record<string, number> = {
				urgente: 1,
				importante: 2,
				recordatorio: 3,
				normal: 4,
				solicitud: 5,
			};

			if (typeMap[selectedType] && notification.type !== typeMap[selectedType]) {
				return false;
			}
		}

		return true;
	});

	// Actions
	const resetFilters = () => {
		setSelectedDate('');
		setFilterByRut(false);
		setRutFilter('');
		setShowPendingOnly(false);
		setSelectedType('all');
	};

	const handleRutChange = (value: string) => {
		setRutFilter(value);
	};

	// Notification actions (these would typically connect to actual handlers)
	const handleViewNotificationDetails = (notification: Notification) => {
		console.log('View notification details:', notification);
		// TODO: Implement notification details modal/page
	};

	const handleViewPatientDetails = (patientRut: number, patientName?: string) => {
		console.log('View patient details:', patientRut, patientName);
		// TODO: Navigate to patient details page
	};

	const completeNotification = (id: number, notes?: string) => {
		console.log('Complete notification:', id, notes);
		// TODO: Implement notification completion API call
	};

	const openAddEventDialog = (patientRut?: number) => {
		console.log('Open add event dialog:', patientRut);
		// TODO: Implement event/appointment creation
	};

	// Left sidebar actions
	const handleAddPatient = () => {
		console.log('Add patient action');
		// TODO: Navigate to add patient form or open modal
	};

	const handleSearchPatient = () => {
		console.log('Search patient action');
		// TODO: Open patient search modal or navigate to search page
	};

	const value: NotificationContextType = {
		// Filter state
		selectedDate,
		setSelectedDate,
		filterByRut,
		setFilterByRut,
		rutFilter,
		setRutFilter,
		showPendingOnly,
		setShowPendingOnly,
		selectedType,
		setSelectedType,

		// Notifications data
		notifications,
		filteredNotifications,

		// UI state
		sidebarCollapsed,
		setSidebarCollapsed,
		isExtraSmallScreen,

		// Actions
		resetFilters,
		handleRutChange,

		// Notification actions
		handleViewNotificationDetails,
		handleViewPatientDetails,
		completeNotification,
		openAddEventDialog,

		// Left sidebar actions
		handleAddPatient,
		handleSearchPatient,
	};

	return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error('useNotificationContext must be used within a NotificationProvider');
	}
	return context;
}
