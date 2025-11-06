import type { PatientsLanguages } from './en';

export const es: PatientsLanguages = {
	patients: {
		title: 'Pacientes',
		affiliationLabel: 'Afiliación:',
		loadingText: 'Cargando pacientes...',
		errorMessage: 'No se pudieron cargar los pacientes. Por favor, inténtelo de nuevo.',
		noAffiliationSelected:
			'No hay una afiliación seleccionada. Por favor, seleccione una afiliación para ver los pacientes.',
		noFilteredPatients: 'No hay pacientes que coincidan con el filtro seleccionado.',
		refreshButton: 'Actualizar',
		refreshingButton: 'Actualizando...',
		filterCount: '{filtered} de {total}',
		tableColumns: {
			name: 'Nombre',
			rut: 'RUT',
			age: 'Edad',
			state: 'Estado',
			lastControl: 'Último Control',
		},
		states: {
			all: 'Todos',
			active: 'Activo',
			inactive: 'Inactivo',
			suspended: 'Suspendido',
			affiliationInactive: 'Afiliación Inactiva',
		},
		empty: {
			title: 'No hay pacientes',
			description: 'No se encontraron pacientes para mostrar.',
		},
	},
	components: {
		leftSidebar: {
			quickActions: 'ACCIONES RÁPIDAS',
			addPatient: 'Agregar Paciente',
			filterByState: 'Filtrar por Estado',
		},
		patientsTable: {
			search: 'Buscar pacientes...',
			noResults: 'No se encontraron pacientes',
			loading: 'Cargando...',
			rowsPerPage: 'Filas por página',
			page: 'Página',
			of: 'de',
			previous: 'Anterior',
			next: 'Siguiente',
			actions: 'Acciones',
			viewDetails: 'Ver Detalles',
			editPatient: 'Editar Paciente',
		},
		filter: {
			clearFilters: 'Limpiar filtros',
			applyFilters: 'Aplicar filtros',
		},
	},
};
