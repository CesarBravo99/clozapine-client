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
	selectedPrescription: PrescriptionTableData | null;
	isDetailDialogOpen: boolean;
	isDialogActionLoading: boolean;
	activeDialogAction: 'cancel' | 'renew' | null;
	dialogActionError: string | null;

	// Actions
	setStatusFilter: (status: string) => void;
	handleAddPrescription: () => void;
	handleRefresh: () => void;
	openPrescriptionDetail: (prescription: PrescriptionTableData) => void;
	closePrescriptionDetail: () => void;
	cancelPrescription: () => Promise<void>;
	renewPrescription: () => Promise<void>;
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
	const [selectedPrescription, setSelectedPrescription] =
		useState<PrescriptionTableData | null>(null);
	const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
	const [dialogActionState, setDialogActionState] = useState<{
		loading: boolean;
		action: 'cancel' | 'renew' | null;
		error: string | null;
	}>({
		loading: false,
		action: null,
		error: null,
	});

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

	const openPrescriptionDetail = (prescription: PrescriptionTableData) => {
		setSelectedPrescription(prescription);
		setDetailDialogOpen(true);
		setDialogActionState({
			loading: false,
			action: null,
			error: null,
		});
	};

	const closePrescriptionDetail = () => {
		setDetailDialogOpen(false);
		setSelectedPrescription(null);
		setDialogActionState({
			loading: false,
			action: null,
			error: null,
		});
	};

	const performDialogAction = async (action: 'cancel' | 'renew') => {
		if (!selectedPrescription) {
			return;
		}

		setDialogActionState({
			loading: true,
			action,
			error: null,
		});

		try {
			// TODO: Integrate actual API call
			await new Promise((resolve) => setTimeout(resolve, 600));
			console.log(
				`[Prescriptions] ${action} prescription ${selectedPrescription.prescriptionId}`
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Unexpected error while processing action';
			setDialogActionState({
				loading: false,
				action: null,
				error: message,
			});
			return;
		}

		setDialogActionState({
			loading: false,
			action: null,
			error: null,
		});
	};

	const cancelPrescription = () => performDialogAction('cancel');
	const renewPrescription = () => performDialogAction('renew');

	const value: PrescriptionsContextType = {
		// State
		statusFilter,
		prescriptions,
		filteredPrescriptions,
		loading,
		error,
		selectedPrescription,
		isDetailDialogOpen,
		isDialogActionLoading: dialogActionState.loading,
		activeDialogAction: dialogActionState.action,
		dialogActionError: dialogActionState.error,

		// Actions
		setStatusFilter,
		handleAddPrescription,
		handleRefresh,
		openPrescriptionDetail,
		closePrescriptionDetail,
		cancelPrescription,
		renewPrescription,
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
