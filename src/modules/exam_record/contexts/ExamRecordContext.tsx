import { createContext, useContext } from 'react';
import type { ExamRecordOverview } from '@/api/exam-record';

export type ExamRecordSection = 'personal' | 'documents' | 'symptoms';

export interface UploadedDocument {
	id: string;
	name: string;
}

export interface ExamRecordContextValue {
	overview: ExamRecordOverview | null;
	expandedSection: ExamRecordSection | null;
	toggleSection: (section: ExamRecordSection) => void;

	uploadedDocuments: UploadedDocument[];
	handleDocumentUpload: (docId: string, fileName: string) => void;

	selectedSymptoms: Set<string>;
	toggleSymptom: (symptomId: string) => void;
	notes: string;
	setNotes: (value: string) => void;

	isSubmitting: boolean;
	submitExamRecord: () => void;
	isSubmitSuccess: boolean;
	resetSubmitSuccess: () => void;

	isErrorDialogOpen: boolean;
	setErrorDialogOpen: (open: boolean) => void;
	reportError: (rut: string, errorType: string, description: string) => void;
	isReportingError: boolean;
}

export const ExamRecordContext = createContext<ExamRecordContextValue | undefined>(undefined);

export const useExamRecordContext = () => {
	const context = useContext(ExamRecordContext);
	if (!context) {
		throw new Error('useExamRecordContext must be used within ExamRecordProvider');
	}
	return context;
};

