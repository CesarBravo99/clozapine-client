import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PrescriptionTableData } from '@/api/prescriptions/types/prescription.types';
import { filterPrescriptionsByStatus } from '../utils/filterPrescriptions';

interface PrescriptionsContextType {
	// State
	statusFilter: string;
	prescriptions: PrescriptionTableData[];
	filteredPrescriptions: PrescriptionTableData[];
	loading: boolean;
	error: string | null;

	// Actions
	setStatusFilter: (status: string) => void;
	handleAddPrescription: () => void;
	handleRefresh: () => void;
}

const PrescriptionsContext = createContext<PrescriptionsContextType | undefined>(undefined);

interface PrescriptionsProviderProps {
	children: ReactNode;
	initialPrescriptions?: PrescriptionTableData[];
	onRefresh?: () => void;
	loading?: boolean;
	error?: string | null;
}

export function PrescriptionsProvider({
	children,
	initialPrescriptions = [],
	onRefresh,
	loading = false,
	error = null,
}: PrescriptionsProviderProps) {
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [prescriptions, setPrescriptions] =
		useState<PrescriptionTableData[]>(initialPrescriptions);

	// Update prescriptions when initialPrescriptions changes
	useEffect(() => {
		setPrescriptions(initialPrescriptions);
	}, [initialPrescriptions]);

	// Calculate filtered prescriptions based on current filter
	const filteredPrescriptions = filterPrescriptionsByStatus(prescriptions, statusFilter);

	const handleAddPrescription = () => {
		// TODO: Implement add prescription functionality
		console.log('Add prescription clicked');
		// This could navigate to a new prescription form or open a modal
	};

	const handleRefresh = () => {
		if (onRefresh) {
			onRefresh();
		}
	};

	const value: PrescriptionsContextType = {
		// State
		statusFilter,
		prescriptions,
		filteredPrescriptions,
		loading,
		error,

		// Actions
		setStatusFilter,
		handleAddPrescription,
		handleRefresh,
	};

	return <PrescriptionsContext.Provider value={value}>{children}</PrescriptionsContext.Provider>;
}

export function usePrescriptionsContext() {
	const context = useContext(PrescriptionsContext);
	if (context === undefined) {
		throw new Error('usePrescriptionsContext must be used within a PrescriptionsProvider');
	}
	return context;
}
