import type { CalendarModuleTranslations } from './en';

export const es: CalendarModuleTranslations = {
	page: {
		title: 'Calendario',
		addEvent: 'Nueva cita',
		today: 'Hoy',
		searchPlaceholder: 'Buscar paciente por nombre o RUT…',
		viewLabels: {
			day: 'Día',
			week: 'Semana',
			month: 'Mes',
		},
	},
	components: {
		leftSidebar: {
			quickActions: 'ACCIONES RÁPIDAS',
			addEvent: 'Agendar cita',
			goToday: 'Ir a hoy',
		},
		statusLegend: {
			title: 'Estados',
			pending: 'Pendiente',
			confirmed: 'Confirmada',
			completed: 'Completada',
			cancelled: 'Cancelada',
		},
	},
	dialogs: {
		addEvent: {
			title: 'Agendar cita',
			description: 'Complete la información para registrar una nueva cita.',
			cancel: 'Cancelar',
			confirm: 'Agendar',
		},
		eventDetails: {
			title: 'Detalle de la cita',
			cancel: 'Cerrar',
			delete: 'Eliminar cita',
			statusLabel: 'Estado',
		},
		affiliationSelector: {
			title: 'Seleccionar hospital',
			description: 'Elija la afiliación que desea gestionar.',
			confirm: 'Confirmar selección',
		},
	},
	messages: {
		eventCreated: 'Cita agendada correctamente',
		eventStatusUpdated: 'Estado de la cita actualizado',
		eventDeleted: 'Cita eliminada',
	},
};

