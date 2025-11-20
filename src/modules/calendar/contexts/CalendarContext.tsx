import { createContext, useContext } from 'react';
import type {
	CalendarEvent,
	CalendarEventPayload,
	CalendarEventStatus,
	CalendarPatientSummary,
} from '@/api/calendar';

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEventForm extends Omit<CalendarEventPayload, 'durationMinutes'> {
	durationMinutes: number;
}

export interface CalendarContextValue {
	date: Date;
	view: CalendarView;
	setView: (view: CalendarView) => void;
	handleNext: () => void;
	handlePrevious: () => void;
	handleToday: () => void;
	weekDays: Date[];
	monthDays: Date[];
	workingHours: number[];

	events: CalendarEvent[];
	getEventsByDate: (day: Date) => CalendarEvent[];

	selectedEvent: CalendarEvent | null;
	setSelectedEvent: (event: CalendarEvent | null) => void;

	isAddEventOpen: boolean;
	setAddEventOpen: (open: boolean) => void;
	isEventDetailsOpen: boolean;
	setEventDetailsOpen: (open: boolean) => void;
	isAffiliationDialogOpen: boolean;
	setAffiliationDialogOpen: (open: boolean) => void;

	newEventForm: CalendarEventForm;
	updateNewEventForm: (partial: Partial<CalendarEventForm>) => void;
	handleTimeSlotSelection: (day: Date, time: string) => void;
	createEvent: () => void;
	updateEventStatus: (status: CalendarEventStatus) => void;
	deleteEvent: () => void;

	patients: CalendarPatientSummary[];

	sidebarCollapsed: boolean;
	isExtraSmallScreen: boolean;

	successMessage: string | null;
	showSuccessMessage: (message: string) => void;
	hideSuccessMessage: () => void;
}

export const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

export const useCalendarContext = () => {
	const context = useContext(CalendarContext);
	if (!context) {
		throw new Error('useCalendarContext must be used within a CalendarProvider');
	}
	return context;
};

