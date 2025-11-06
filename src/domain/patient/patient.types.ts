import type { PatientAffiliation } from './patient-affiliation.types';

export enum PatientGender {
	Male = 0,
	Female = 1,
	Other = 2,
}

export interface Patient {
	// patient identifiers
	readonly patientRut: number;
	readonly patientFirstName: string;
	readonly patientLastName: string;
	readonly patientGender: PatientGender;
	readonly patientBirthday: string;
	readonly patientEmail: string;
	readonly patientPhone: string;
	readonly patientAddress: string;
	readonly caretaker?: {
		readonly caretakerFirstName?: string;
		readonly caretakerLastName?: string;
		readonly caretakerPhone?: string;
		readonly caretakerRelationship?: string;
	};

	// Affiliations
	readonly affiliationHistory: PatientAffiliation[];
	readonly mainAffiliation: PatientAffiliation;

	// Antedecentes
	readonly patientAllergy: string[];
	readonly patientAscendants: boolean;
	readonly patientCurrentMedication: string[];
	readonly patientNotes: string[];
	readonly clozapineIsActive: boolean;
	readonly clozapineWasSuspended: boolean;
	readonly clozapineStartDate?: string;

	// Clinical records
	readonly diagnosis: Diagnosis[];
	// readonly patientClinicalHistory: ClinicalRecord[];

	// frontend use
	readonly patientFullName: string;
	readonly patientFullNameFormatted: string;
	readonly patientAgeFormatted: string;
	readonly patientBirthdayFormatted: string;
	readonly patientPhoneFormatted: string;
	readonly patientAddressFormatted: string;
	readonly patientAge: number;
}

export interface Diagnosis {
	readonly name: string;
	readonly date: string;
	readonly description: string;
	readonly isPrimary: boolean;
}
