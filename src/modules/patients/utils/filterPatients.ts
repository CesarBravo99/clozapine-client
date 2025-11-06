import type { PatientTableData } from '@/api/patients/types/patient.types';

export function filterPatientsByState(
	patients: PatientTableData[],
	filterType: string
): PatientTableData[] {
	if (filterType === 'all') {
		return patients;
	}

	return patients.filter((patient) => {
		const state = patient.state.toLowerCase();

		switch (filterType) {
			case 'active':
				return state === 'activo';
			case 'inactive':
				return state === 'inactivo' || state === 'afiliación inactiva';
			case 'suspended':
				return state === 'suspendido';
			default:
				return true;
		}
	});
}

export function getPatientStateFromData(patient: PatientTableData): string {
	const state = patient.state.toLowerCase();

	if (state === 'activo') return 'active';
	if (state === 'inactivo' || state === 'afiliación inactiva') return 'inactive';
	if (state === 'suspendido') return 'suspended';

	return 'inactive'; // default
}
