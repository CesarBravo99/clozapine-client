import { useState } from 'react';
import type { PatientTableData } from '@/api/patients/types/patient.types';

export const usePatients = (initialData: PatientTableData[] = []) => {
	const [patients, setPatients] = useState<PatientTableData[]>(initialData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refetch = async (fetchFunction: () => Promise<PatientTableData[]>) => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchFunction();
			setPatients(data);
		} catch (err) {
			console.error('Error refetching patients:', err);
			setError(err instanceof Error ? err.message : 'Error al recargar pacientes');
		} finally {
			setLoading(false);
		}
	};

	return {
		patients,
		loading,
		error,
		refetch,
		setPatients,
	};
};
