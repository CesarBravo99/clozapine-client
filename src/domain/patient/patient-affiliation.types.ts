export interface PatientAffiliation {
	// Server information
	readonly patientAffiliationId: number;
	readonly patientRut: number;
	readonly userRut: number;
	readonly affiliationId: number;
	readonly affiliationDate: string;
	readonly affiliationStatus: AffiliationStatus;

	// Frontend use
	readonly userRutFormatted: string;
	readonly affiliationName: string;
	readonly affiliationDateFormatted: string;
}

export enum AffiliationStatus {
	Active = 0,
	Inactive = 1,
	Pending = 2,
	Retired = 3,
}
