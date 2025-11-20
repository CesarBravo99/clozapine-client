import {
	type ReactNode,
	useCallback,
	useMemo,
	useRef,
	useState,
	useEffect,
} from 'react';
import { ExamRecordContext, type ExamRecordSection, type UploadedDocument } from '@/modules/exam_record/contexts/ExamRecordContext';
import {
	type ExamRecordOverview,
	reportExamError,
	submitExamRecord,
} from '@/api/exam-record';
import { useRouteContext } from '@tanstack/react-router';

interface ExamRecordProviderProps {
	children: ReactNode;
	overview: ExamRecordOverview | null;
	rut: number | null;
}

export function ExamRecordProvider({ children, overview, rut }: ExamRecordProviderProps) {
	const routeContext = useRouteContext({ from: '__root__' });
	const axiosClient = routeContext.axiosClient;

	const [expandedSection, setExpandedSection] = useState<ExamRecordSection | null>('personal');
	const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
	const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
	const [notes, setNotes] = useState('');
	const [isSubmitting, setSubmitting] = useState(false);
	const [isSubmitSuccess, setSubmitSuccess] = useState(false);
	const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
	const [isReportingError, setReportingError] = useState(false);

	useEffect(() => {
		return () => {
			if (successTimeoutRef.current) {
				clearTimeout(successTimeoutRef.current);
			}
		};
	}, []);

	const toggleSection = (section: ExamRecordSection) => {
		setExpandedSection((prev) => (prev === section ? null : section));
	};

	const handleDocumentUpload = (docId: string, fileName: string) => {
		setUploadedDocuments((prev) => {
			const without = prev.filter((doc) => doc.id !== docId);
			return [...without, { id: docId, name: fileName }];
		});
	};

	const toggleSymptom = (symptomId: string) => {
		setSelectedSymptoms((prev) => {
			const updated = new Set(prev);
			if (updated.has(symptomId)) {
				updated.delete(symptomId);
			} else {
				updated.add(symptomId);
			}
			return updated;
		});
	};

	const submitExam = useCallback(async () => {
		if (isSubmitting) return;
		setSubmitting(true);
		await submitExamRecord(
			{
				rut: overview?.patient.rut ?? '',
				email: '', // optional for backend; currently empty
				symptoms: Array.from(selectedSymptoms),
				notes,
			},
			axiosClient
		);
		setSubmitting(false);
		setSubmitSuccess(true);
		successTimeoutRef.current = setTimeout(() => setSubmitSuccess(false), 4000);
	}, [axiosClient, isSubmitting, notes, overview?.patient.rut, selectedSymptoms]);

	const reportErrorHandler = useCallback(
		async (patientRut: string, errorType: string, description: string) => {
			if (isReportingError) return;
			setReportingError(true);
			await reportExamError(
				{
					rut: patientRut,
					errorType,
					description,
				},
				axiosClient
			);
			setReportingError(false);
			setErrorDialogOpen(false);
		},
		[axiosClient, isReportingError]
	);

	const value = useMemo(
		() => ({
			overview,
			expandedSection,
			toggleSection,
			uploadedDocuments,
			handleDocumentUpload,
			selectedSymptoms,
			toggleSymptom,
			notes,
			setNotes,
			isSubmitting,
			submitExamRecord: submitExam,
			isSubmitSuccess,
			resetSubmitSuccess: () => setSubmitSuccess(false),
			isErrorDialogOpen,
			setErrorDialogOpen,
			reportError: reportErrorHandler,
			isReportingError,
		}),
		[
			expandedSection,
			handleDocumentUpload,
			isErrorDialogOpen,
			isReportingError,
			isSubmitSuccess,
			isSubmitting,
			notes,
			overview,
			reportErrorHandler,
			selectedSymptoms,
			submitExam,
			uploadedDocuments,
		]
	);

	return <ExamRecordContext.Provider value={value}>{children}</ExamRecordContext.Provider>;
}

