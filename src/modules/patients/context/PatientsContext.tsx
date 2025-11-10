import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PatientDetail, PatientTableData } from '@/api/patients/types/patient.types';
import { filterPatientsByState } from '../utils/filterPatients';
import axiosClient from '@/api/axiosClient';
import { getPatientDetail } from '@/api/patients';

interface PatientsContextType {
	// State
	filterType: string;
	patients: PatientTableData[];
	filteredPatients: PatientTableData[];
	loading: boolean;
	error: string | null;
	selectedPatient: PatientTableData | null;
	selectedPatientDetail: PatientDetail | null;
	isPatientDetailsLoading: boolean;
	patientDetailsError: string | null;
	isPatientDetailsOpen: boolean;
	isAddPatientListOpen: boolean;

	// Actions
	setFilterType: (type: string) => void;
	handleAddPatient: () => void;
	handleRefresh: () => void;
	openPatientDetails: (patient: PatientTableData) => void;
	closePatientDetails: () => void;
	openAddPatientListDialog: () => void;
	closeAddPatientListDialog: () => void;
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
	const [selectedPatient, setSelectedPatient] = useState<PatientTableData | null>(null);
	const [selectedPatientDetail, setSelectedPatientDetail] = useState<PatientDetail | null>(null);
	const [isPatientDetailsLoading, setPatientDetailsLoading] = useState(false);
	const [patientDetailsError, setPatientDetailsError] = useState<string | null>(null);
	const [isPatientDetailsOpen, setPatientDetailsOpen] = useState(false);
	const [isAddPatientListOpen, setAddPatientListOpen] = useState(false);
	const [patientDetailsCache, setPatientDetailsCache] = useState<Record<number, PatientDetail>>(
		{}
	);

	// Update patients when initialPatients changes
	useEffect(() => {
		setPatients(initialPatients);
	}, [initialPatients]);

	// Calculate filtered patients based on current filter
	const filteredPatients = filterPatientsByState(patients, filterType);

	const handleAddPatient = () => {
		setAddPatientListOpen(true);
	};

	const handleRefresh = () => {
		if (onRefresh) {
			onRefresh();
		}
	};

	const openPatientDetails = (patient: PatientTableData) => {
		setSelectedPatient(patient);
		setSelectedPatientDetail(null);
		setPatientDetailsError(null);
		setPatientDetailsOpen(true);

		const cachedDetail = patientDetailsCache[patient.patientRut];
		if (cachedDetail) {
			setSelectedPatientDetail(cachedDetail);
			setPatientDetailsLoading(false);
			return;
		}

		setPatientDetailsLoading(true);

		getPatientDetail(patient.patientRut, axiosClient)
			.then((detail) => {
				setSelectedPatientDetail(detail);
				setPatientDetailsCache((prev) => ({
					...prev,
					[patient.patientRut]: detail,
				}));
			})
			.catch((error: unknown) => {
				const message =
					error instanceof Error ? error.message : 'Failed to load patient details';
				setPatientDetailsError(message);
			})
			.finally(() => {
				setPatientDetailsLoading(false);
			});
	};

	const closePatientDetails = () => {
		setPatientDetailsOpen(false);
		setSelectedPatient(null);
		setSelectedPatientDetail(null);
		setPatientDetailsError(null);
		setPatientDetailsLoading(false);
	};

	const openAddPatientListDialog = () => {
		setAddPatientListOpen(true);
	};

	const closeAddPatientListDialog = () => {
		setAddPatientListOpen(false);
	};

	const value: PatientsContextType = {
		// State
		filterType,
		patients,
		filteredPatients,
		loading,
		error,
		selectedPatient,
		selectedPatientDetail,
		isPatientDetailsLoading,
		patientDetailsError,
		isPatientDetailsOpen,
		isAddPatientListOpen,

		// Actions
		setFilterType,
		handleAddPatient,
		handleRefresh,
		openPatientDetails,
		closePatientDetails,
		openAddPatientListDialog,
		closeAddPatientListDialog,
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
