// API Response types matching the backend PatientAffiliation struct
export interface PatientAffiliationAPIResponse {
	patientAffiliationId: number;
	patientRut: number;
	userRut: number;
	affiliationId: number;
	affiliationDate: string;
	affiliationStatus: AffiliationStatus;
	isMainAffiliation: boolean;
	// Patient details for table display
	firstName?: string;
	lastName?: string;
	birthday?: string;
	clozapineIsActive?: boolean;
}

export enum AffiliationStatus {
	Pending = 0,
	Approved = 1,
	Rejected = 2,
	Retired = 3,
}

// For table display
export interface PatientTableData {
	patientRut: number;
	name: string;
	age: number;
	state: string;
	lastControl: string;
	rawData: PatientAffiliationAPIResponse;
}
