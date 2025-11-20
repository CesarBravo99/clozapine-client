export interface ExamPatientInfo {
	fullName: string;
	lastName: string;
	rut: string;
	age: number;
	birthDate: string;
	ancestryQuestion: string;
	ancestryAnswer: string;
}

export interface ExamDocumentRequirement {
	id: string;
	label: string;
	description: string;
	supportedTypes: string[];
}

export interface ExamSymptomOption {
	id: string;
	label: string;
	description?: string;
}

export interface ExamRecordOverview {
	patient: ExamPatientInfo;
	documents: ExamDocumentRequirement[];
	symptoms: ExamSymptomOption[];
	lastUpdated: string;
}

export interface ExamRecordSubmission {
	rut: string;
	email: string;
	symptoms: string[];
	notes?: string;
}

export interface ExamErrorReportPayload {
	rut: string;
	errorType: string;
	description: string;
}

