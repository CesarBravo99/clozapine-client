import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { HelpContext, type HelpTab, type PatientFormState, type StaffFormState, type DeveloperFormState } from '@/modules/help/contexts/HelpContext';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/help/lang';
import type { HelpOverview } from '@/api/help';

interface HelpUser {
	isAuthenticated: boolean;
	name?: string | null;
	email?: string | null;
}

interface HelpProviderProps {
	children: ReactNode;
	helpData: HelpOverview | null;
	user: HelpUser;
}

const DEFAULT_PATIENT_FORM: PatientFormState = {
	name: '',
	rut: '',
	email: '',
	phone: '',
	hospitalId: '',
	otherHospital: '',
	subject: '',
	message: '',
};

const DEFAULT_STAFF_FORM: StaffFormState = {
	hospitalId: '',
	otherHospital: '',
	issueType: '',
	message: '',
};

const DEFAULT_DEVELOPER_FORM: DeveloperFormState = {
	name: '',
	email: '',
	userType: '',
	issueType: '',
	priority: '',
	message: '',
};

export function HelpProvider({ children, helpData, user }: HelpProviderProps) {
	const lang = useSelector(selectLang);
	const translations = langs[lang] ?? langs.es;

	const [activeTab, setActiveTab] = useState<HelpTab>('patient');
	const [patientForm, setPatientForm] = useState<PatientFormState>(DEFAULT_PATIENT_FORM);
	const [staffForm, setStaffForm] = useState<StaffFormState>(DEFAULT_STAFF_FORM);
	const [developerForm, setDeveloperForm] = useState<DeveloperFormState>(DEFAULT_DEVELOPER_FORM);
	const [staffAuthenticated, setStaffAuthenticated] = useState<boolean>(user.isAuthenticated);

	const [isSubmitting, setSubmitting] = useState(false);
	const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);


	useEffect(() => {
		return () => {
			if (successTimeoutRef.current) {
				clearTimeout(successTimeoutRef.current);
			}
		};
	}, []);

	const showSuccess = useCallback((message: string) => {
		if (successTimeoutRef.current) {
			clearTimeout(successTimeoutRef.current);
		}
		setSuccessMessage(message);
		successTimeoutRef.current = setTimeout(() => {
			setSuccessMessage(null);
			successTimeoutRef.current = null;
		}, 3000);
	}, []);

	const hideSuccessMessage = useCallback(() => {
		if (successTimeoutRef.current) {
			clearTimeout(successTimeoutRef.current);
			successTimeoutRef.current = null;
		}
		setSuccessMessage(null);
	}, []);

	const updatePatientForm = (partial: Partial<PatientFormState>) => {
		setPatientForm((prev) => ({ ...prev, ...partial }));
	};

	const updateStaffForm = (partial: Partial<StaffFormState>) => {
		setStaffForm((prev) => ({ ...prev, ...partial }));
	};

	const updateDeveloperForm = (partial: Partial<DeveloperFormState>) => {
		setDeveloperForm((prev) => ({ ...prev, ...partial }));
	};

	const submitWithReset = async (resetFn: () => void) => {
		setSubmitting(true);
		setTimeout(() => {
			setSubmitting(false);
			resetFn();
		}, 400);
	};

	const submitPatientForm = () => {
		void submitWithReset(() => {
			setPatientForm(DEFAULT_PATIENT_FORM);
			showSuccess(translations.messages.formSubmitted);
		});
	};

	const submitStaffForm = () => {
		void submitWithReset(() => {
			setStaffForm(DEFAULT_STAFF_FORM);
			showSuccess(translations.messages.formSubmitted);
		});
	};

	const submitDeveloperForm = () => {
		void submitWithReset(() => {
			setDeveloperForm(DEFAULT_DEVELOPER_FORM);
			showSuccess(translations.messages.formSubmitted);
		});
	};

	const simulateStaffLogin = () => {
		setStaffAuthenticated(true);
		showSuccess(translations.messages.loggedIn);
	};

	const contextValue = useMemo(
		() => ({
			activeTab,
			setActiveTab,
			hospitals: helpData?.hospitals ?? [],
			patientSubjects: helpData?.patientSubjects ?? [],
			staffIssueTypes: helpData?.staffIssueTypes ?? [],
			developerIssueTypes: helpData?.developerIssueTypes ?? [],
			developerPriorities: helpData?.developerPriorities ?? [],
			patientForm,
			updatePatientForm,
			submitPatientForm,
			showPatientOtherHospital: patientForm.hospitalId === 'other',
			staffForm,
			updateStaffForm,
			submitStaffForm,
			showStaffOtherHospital: staffForm.hospitalId === 'other',
			staffAuthenticated,
			simulateStaffLogin,
			developerForm,
			updateDeveloperForm,
			submitDeveloperForm,
			isSubmitting,
			successMessage,
			hideSuccessMessage,
			userName: user.name ?? null,
			userEmail: user.email ?? null,
		}),
		[
			activeTab,
			helpData,
			patientForm,
			staffForm,
			staffAuthenticated,
			developerForm,
			isSubmitting,
			successMessage,
			user.name,
			user.email,
		]
	);

	return <HelpContext.Provider value={contextValue}>{children}</HelpContext.Provider>;
}

