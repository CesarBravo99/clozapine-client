import type { AppLanguages } from './en';

export const es: AppLanguages = {
	notifications: {
		title: 'Notificaciones',
		userLabel: 'Usuario:',
		loadingText: 'Cargando notificaciones...',
		errorMessage: 'No se pudieron cargar las notificaciones. Por favor, inténtelo de nuevo.',
		notificationLabels: {
			id: 'ID:',
			affiliation: 'Afiliación:',
			user: 'Usuario:',
		},
		empty: {
			title: 'No hay notificaciones',
			description: 'No se encontraron notificaciones para mostrar.',
		},
	},
	components: {
		notificationList: {
			noNotifications: 'No hay notificaciones',
			noFilteredNotifications:
				'No se encontraron notificaciones con los filtros seleccionados',
			showAllNotifications: 'Mostrar todas las notificaciones',
			viewProfile: 'Ver ficha',
			schedule: 'Agendar',
		},
		notificationListItem: {
			complete: 'Completar',
			completedBy: 'Completado por {name} el {date}',
			completed: 'Completado',
		},
		rightSidebar: {
			advancedFilters: 'FILTROS AVANZADOS',
			date: 'Fecha',
			filterByRut: 'Filtrar por RUT',
			clearFilters: 'Limpiar filtros',
			quickFilters: 'FILTROS RÁPIDOS',
			pending: 'Pendientes',
			lastWeek: 'Última semana',
			byType: 'POR TIPO',
			urgent: 'Urgente',
			important: 'Importante',
			reminder: 'Recordatorio',
			normal: 'Normal',
			requests: 'Solicitudes',
		},
		notificationFilters: {
			filters: 'Filtros',
			filterByDate: 'Filtrar por fecha',
			filterByType: 'Filtrar por tipo',
			selectType: 'Seleccionar tipo',
			allTypes: 'Todos los tipos',
			urgent: 'Urgente',
			important: 'Importante',
			informative: 'Informativo',
			reminder: 'Recordatorio',
			request: 'Solicitud',
			control: 'Control',
			suggestion: 'Sugerencia',
			showPendingOnly: 'Mostrar solo pendientes',
			filterByRut: 'Filtrar por RUT',
			clearFilters: 'Limpiar filtros',
		},
		leftSidebar: {
			quickActions: 'ACCIONES RÁPIDAS',
			scheduleAppointment: 'Agendar cita',
			addPatient: 'Agregar paciente',
			searchPatient: 'Buscar paciente',
		},
	},
};
