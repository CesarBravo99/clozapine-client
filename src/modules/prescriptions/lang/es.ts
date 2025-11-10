import type { PrescriptionsLanguages } from './en';

export const es: PrescriptionsLanguages = {
	prescriptions: {
		title: 'Prescripciones',
		userLabel: 'Usuario:',
		loadingText: 'Cargando prescripciones...',
		errorMessage: 'No se pudieron cargar las prescripciones. Por favor, inténtelo de nuevo.',
		noUserSelected:
			'No hay un usuario seleccionado. Por favor, seleccione un usuario para ver las prescripciones.',
		noFilteredPrescriptions: 'No hay prescripciones que coincidan con el filtro seleccionado.',
		refreshButton: 'Actualizar',
		refreshingButton: 'Actualizando...',
		filterCount: '{filtered} de {total}',
		tableColumns: {
			patient: 'Paciente',
			medication: 'Medicamento',
			date: 'Fecha',
			status: 'Estado',
		},
		statuses: {
			all: 'Todos',
			active: 'Activo',
			suspended: 'Suspendido',
			completed: 'Completado',
		},
		empty: {
			title: 'No hay prescripciones',
			description: 'No se encontraron prescripciones para mostrar.',
		},
	},
	components: {
		leftSidebar: {
			quickActions: 'ACCIONES RÁPIDAS',
			addPrescription: 'Agregar Prescripción',
			filterByStatus: 'Filtrar por Estado',
		},
		prescriptionsTable: {
			search: 'Buscar prescripciones...',
			noResults: 'No se encontraron prescripciones',
			loading: 'Cargando...',
			rowsPerPage: 'Filas por página',
			page: 'Página',
			of: 'de',
			previous: 'Anterior',
			next: 'Siguiente',
			actions: 'Acciones',
			viewDetails: 'Ver Detalles',
			editPrescription: 'Editar Prescripción',
		},
		filter: {
			clearFilters: 'Limpiar filtros',
			applyFilters: 'Aplicar filtros',
		},
	},
	dialogs: {
		detail: {
			title: 'Detalles de la prescripción',
			subtitle: 'Revise la prescripción antes de tomar una acción.',
			sections: {
				patient: 'Información del paciente',
			},
			labels: {
				patientRut: 'RUT',
				medication: 'Medicamento',
				status: 'Estado',
				dosage: 'Dosis',
				schedule: 'Frecuencia',
				duration: 'Duración',
				route: 'Vía de administración',
				date: 'Fecha de prescripción',
				clinicalRecord: 'Ficha clínica',
				notes: 'Notas',
				noNotes: 'Sin notas registradas',
				notAvailable: 'No disponible',
			},
			errorPrefix: 'No se pudo completar la acción',
			buttons: {
				cancel: 'Cancelar prescripción',
				canceling: 'Cancelando…',
				renew: 'Renovar prescripción',
				renewing: 'Renovando…',
			},
		},
	},
};
