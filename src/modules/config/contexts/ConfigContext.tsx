import { createContext, useContext } from 'react';
import type {
	ConfigAffiliationSettings,
	ConfigPasswordPolicy,
	ConfigPersonnel,
	ConfigSecuritySettings,
} from '@/api/config';

export type ConfigTab = 'security' | 'users' | 'hospital';

export interface PersonnelFormData {
	id?: number;
	name: string;
	role: string;
	rut: string;
	email: string;
	phone: string;
	status: ConfigPersonnel['status'];
}

export interface ConfigContextValue {
	userRut: number | null;
	activeTab: ConfigTab;
	setActiveTab: (tab: ConfigTab) => void;
	sidebarCollapsed: boolean;
	isExtraSmallScreen: boolean;

	searchTerm: string;
	setSearchTerm: (value: string) => void;
	personnel: ConfigPersonnel[];
	filteredPersonnel: ConfigPersonnel[];

	selectedPersonnel: ConfigPersonnel | null;
	setSelectedPersonnel: (person: ConfigPersonnel | null) => void;

	isAddPersonnelDialogOpen: boolean;
	setAddPersonnelDialogOpen: (open: boolean) => void;
	isEditPersonnelDialogOpen: boolean;
	setEditPersonnelDialogOpen: (open: boolean) => void;
	isDeletePersonnelDialogOpen: boolean;
	setDeletePersonnelDialogOpen: (open: boolean) => void;
	isResetPasswordDialogOpen: boolean;
	setResetPasswordDialogOpen: (open: boolean) => void;

	handleAddPersonnel: (payload: PersonnelFormData) => void;
	handleEditPersonnel: (payload: PersonnelFormData) => void;
	handleDeletePersonnel: () => void;
	handleResetPassword: () => void;

	securitySettings: ConfigSecuritySettings;
	updateSecuritySettings: (partial: Partial<ConfigSecuritySettings>) => void;
	persistSecuritySettings: () => void;
	passwordPolicy: ConfigPasswordPolicy;
	updatePasswordPolicy: (partial: Partial<ConfigPasswordPolicy>) => void;
	persistPasswordPolicy: () => void;
	affiliationSettings: ConfigAffiliationSettings;
	updateAffiliationSettings: (partial: Partial<ConfigAffiliationSettings>) => void;
	persistAffiliationSettings: () => void;

	successMessage: string | null;
	showSuccessMessage: (message: string) => void;
	hideSuccessMessage: () => void;
}

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function useConfigContext() {
	const context = useContext(ConfigContext);
	if (!context) {
		throw new Error('useConfigContext must be used within a ConfigProvider');
	}
	return context;
}

