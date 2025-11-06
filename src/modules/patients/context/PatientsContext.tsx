import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PatientTableData } from '@/api/patients/types/patient.types';
import { filterPatientsByState } from '../utils/filterPatients';

interface PatientsContextType {
	// State
	filterType: string;
	patients: PatientTableData[];
	filteredPatients: PatientTableData[];
	loading: boolean;
	error: string | null;

	// Actions
	setFilterType: (type: string) => void;
	handleAddPatient: () => void;
	handleRefresh: () => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

interface PatientsProviderProps {
	children: ReactNode;
	initialPatients?: PatientTableData[];
	onRefresh?: () => void;
	loading?: boolean;
	error?: string | null;
}

export function PatientsProvider({
	children,
	initialPatients = [],
	onRefresh,
	loading = false,
	error = null,
}: PatientsProviderProps) {
	const [filterType, setFilterType] = useState<string>('all');
	const [patients, setPatients] = useState<PatientTableData[]>(initialPatients);

	// Update patients when initialPatients changes
	useEffect(() => {
		setPatients(initialPatients);
	}, [initialPatients]);

	// Calculate filtered patients based on current filter
	const filteredPatients = filterPatientsByState(patients, filterType);

	const handleAddPatient = () => {
		// TODO: Implement add patient functionality
		console.log('Add patient clicked');
		// This could navigate to a new patient form or open a modal
	};

	const handleRefresh = () => {
		if (onRefresh) {
			onRefresh();
		}
	};

	const value: PatientsContextType = {
		// State
		filterType,
		patients,
		filteredPatients,
		loading,
		error,

		// Actions
		setFilterType,
		handleAddPatient,
		handleRefresh,
	};

	return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
}

export function usePatients() {
	const context = useContext(PatientsContext);
	if (context === undefined) {
		throw new Error('usePatients must be used within a PatientsProvider');
	}
	return context;
}
