import { createContext, useContext } from 'react';
import type { HelpHospital } from '@/api/help';

export type HelpTab = 'patient' | 'staff' | 'developer';

export interface PatientFormState {
	name: string;
	rut: string;
	email: string;
	phone: string;
	hospitalId: number | 'other' | '';
	otherHospital: string;
	subject: string;
	message: string;
}

export interface StaffFormState {
	hospitalId: number | 'other' | '';
	otherHospital: string;
	issueType: string;
	message: string;
}

export interface DeveloperFormState {
	name: string;
	email: string;
	userType: string;
	issueType: string;
	priority: string;
	message: string;
}

export interface HelpContextValue {
	activeTab: HelpTab;
	setActiveTab: (tab: HelpTab) => void;

	hospitals: HelpHospital[];
	patientSubjects: string[];
	staffIssueTypes: string[];
	developerIssueTypes: string[];
	developerPriorities: string[];

	patientForm: PatientFormState;
	updatePatientForm: (partial: Partial<PatientFormState>) => void;
	submitPatientForm: () => void;
	showPatientOtherHospital: boolean;

	staffForm: StaffFormState;
	updateStaffForm: (partial: Partial<StaffFormState>) => void;
	submitStaffForm: () => void;
	showStaffOtherHospital: boolean;
	staffAuthenticated: boolean;
	simulateStaffLogin: () => void;

	developerForm: DeveloperFormState;
	updateDeveloperForm: (partial: Partial<DeveloperFormState>) => void;
	submitDeveloperForm: () => void;

	isSubmitting: boolean;
	successMessage: string | null;
	hideSuccessMessage: () => void;

	userName: string | null;
	userEmail: string | null;
}

export const HelpContext = createContext<HelpContextValue | undefined>(undefined);

export const useHelpContext = () => {
	const context = useContext(HelpContext);
	if (!context) {
		throw new Error('useHelpContext must be used within a HelpProvider');
	}
	return context;
};

