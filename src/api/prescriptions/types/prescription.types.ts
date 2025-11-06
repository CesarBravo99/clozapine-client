// API Response types matching the backend PrescriptionWithPatient struct
export interface PrescriptionAPIResponse {
	prescriptionId: number;
	clinicalRecordId: number;
	userRut: number;
	patientRut: number;
	prescriptionStatus: PrescriptionStatus;
	prescriptionDate: string; // ISO date string
	drugName: string;
	drugForm: string;
	drugDosageQuantity: number;
	drugDosageUnit: string;
	drugAdministrationRoute: string;
	drugTimeQuantity: number;
	drugTimeUnit: string;
	drugDurationQuantity: number;
	drugDurationUnit: string;
	notes: string;
	// Patient information fields from backend
	patientFirstName: string;
	patientLastName: string;
	patientName: string; // Computed field from backend
}

export enum PrescriptionStatus {
	Active = 0,
	Suspended = 1,
	Completed = 2,
}

// For table display
export interface PrescriptionTableData {
	prescriptionId: number;
	patientName: string;
	patientRut: number;
	medication: string; // drugName + drugForm + dosage
	prescriptionDate: string;
	status: string; // mapped from PrescriptionStatus
	rawData: PrescriptionAPIResponse;
}
