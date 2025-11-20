import type { AxiosInstance } from 'axios';
import {
	type CalendarOverview,
	type CalendarEvent,
	type CalendarEventPayload,
	type CalendarEventStatus,
} from './types/calendar.types';

const today = new Date();
const start = new Date(today);
start.setHours(10, 0, 0, 0);
const finish = new Date(start);
finish.setMinutes(start.getMinutes() + 30);

const mockEvents: CalendarEvent[] = [
	{
		id: 'evt-1',
		title: 'Control mensual',
		start: start.toISOString(),
		end: finish.toISOString(),
		patientName: 'Daniela Ramos',
		patientRut: '12.345.678-9',
		patientPhone: '+56 9 1234 5678',
		doctorName: 'Dr. Carlos Mendoza',
		status: 'pending',
	},
];

const mockOverview: CalendarOverview = {
	events: mockEvents,
	patients: [
		{
			rut: '12.345.678-9',
			name: 'Daniela Ramos',
			phone: '+56 9 1234 5678',
			lastAppointment: new Date().toISOString(),
		},
	],
};

export const getCalendarOverview = async (
	userRut: number,
	affiliationId: number,
	axiosClient: AxiosInstance
): Promise<CalendarOverview> => {
	try {
		const response = await axiosClient.get(`/api/v1/affiliations/${affiliationId}/calendar`, {
			params: { userRut },
		});
		return response.data as CalendarOverview;
	} catch (error) {
		console.warn('⚠️ CALENDAR API: Falling back to mock data', error);
		return mockOverview;
	}
};

const buildEventFromPayload = (payload: CalendarEventPayload): CalendarEvent => {
	const start = new Date(`${payload.date}T${payload.time}:00`);
	const end = new Date(start);
	end.setMinutes(start.getMinutes() + payload.durationMinutes);

	return {
		id: `evt-${Date.now()}`,
		title: payload.title,
		start: start.toISOString(),
		end: end.toISOString(),
		patientName: payload.patientName,
		patientRut: payload.patientRut,
		patientPhone: payload.patientPhone,
		doctorName: payload.doctorName,
		notes: payload.notes,
		status: payload.status ?? 'pending',
	};
};

export const createCalendarEvent = async (
	affiliationId: number,
	payload: CalendarEventPayload,
	axiosClient: AxiosInstance
): Promise<CalendarEvent> => {
	try {
		const response = await axiosClient.post(
			`/api/v1/affiliations/${affiliationId}/calendar/events`,
			payload
		);
		return response.data as CalendarEvent;
	} catch (error) {
		console.warn('⚠️ CALENDAR API: Failed to create event, returning mock event', error);
		return buildEventFromPayload(payload);
	}
};

export const updateCalendarEventStatus = async (
	affiliationId: number,
	eventId: string,
	status: CalendarEventStatus,
	axiosClient: AxiosInstance
) => {
	try {
		await axiosClient.patch(
			`/api/v1/affiliations/${affiliationId}/calendar/events/${eventId}`,
			{ status }
		);
	} catch (error) {
		console.warn('⚠️ CALENDAR API: Failed to update event status', error);
	}
};

export const deleteCalendarEvent = async (
	affiliationId: number,
	eventId: string,
	axiosClient: AxiosInstance
) => {
	try {
		await axiosClient.delete(`/api/v1/affiliations/${affiliationId}/calendar/events/${eventId}`);
	} catch (error) {
		console.warn('⚠️ CALENDAR API: Failed to delete event', error);
	}
};

