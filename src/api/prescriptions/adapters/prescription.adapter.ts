import type {
	PrescriptionAPIResponse,
	PrescriptionTableData,
	PrescriptionStatus,
} from '@/api/prescriptions/types/prescription.types';

/**
 * Maps PrescriptionStatus enum to string representation
 */
export const mapPrescriptionStatusToString = (status: PrescriptionStatus): string => {
	switch (status) {
		case 0: // PrescriptionStatus.Active
			return 'active';
		case 1: // PrescriptionStatus.Suspended
			return 'suspended';
		case 2: // PrescriptionStatus.Completed
			return 'completed';
		default:
			return 'active';
	}
};

/**
 * Formats medication information from prescription data
 */
export const formatMedicationInfo = (prescription: PrescriptionAPIResponse): string => {
	const { drugName, drugForm, drugDosageQuantity, drugDosageUnit } = prescription;

	// Build medication string with proper spacing
	const parts = [];

	if (drugName) parts.push(drugName);
	if (drugForm) parts.push(drugForm);
	if (drugDosageQuantity && drugDosageUnit) {
		parts.push(`${drugDosageQuantity}${drugDosageUnit}`);
	}

	return parts.length > 0 ? parts.join(' ') : 'Unknown Medication';
};

/**
 * Formats prescription date to locale string
 */
export const formatPrescriptionDate = (dateString: string): string => {
	if (!dateString) return 'No date';

	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return dateString; // Return original if invalid
		}

		// Format as DD/MM/YYYY for consistency
		return date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	} catch (error) {
		console.warn('Error formatting prescription date:', error);
		return dateString;
	}
};

/**
 * Formats patient name similar to legacy PatientList format
 * Uses the backend-computed patientName field or falls back to first/last name combination
 */
export const formatPatientName = (prescription: PrescriptionAPIResponse): string => {
	// Use backend-computed patientName if available
	if (prescription.patientName && prescription.patientName.trim()) {
		return prescription.patientName.trim();
	}

	// Fallback to combining first and last name
	const firstName = prescription.patientFirstName?.trim() || '';
	const lastName = prescription.patientLastName?.trim() || '';

	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}

	if (firstName) return firstName;
	if (lastName) return lastName;

	// Final fallback similar to legacy PatientList
	return `Paciente RUT ${prescription.patientRut}`;
};

/**
 * Converts PrescriptionAPIResponse to PrescriptionTableData
 */
export const adaptPrescriptionToTableData = (
	prescription: PrescriptionAPIResponse
): PrescriptionTableData => {
	if (!prescription) {
		throw new Error('Prescription data is required');
	}

	return {
		prescriptionId: prescription.prescriptionId || 0,
		patientName: formatPatientName(prescription),
		patientRut: prescription.patientRut || 0,
		medication: formatMedicationInfo(prescription),
		prescriptionDate: formatPrescriptionDate(prescription.prescriptionDate),
		status: mapPrescriptionStatusToString(prescription.prescriptionStatus),
		rawData: prescription,
	};
};

/**
 * Converts array of PrescriptionAPIResponse to PrescriptionTableData array
 */
export const adaptPrescriptionsToTableData = (
	prescriptions: PrescriptionAPIResponse[]
): PrescriptionTableData[] => {
	if (!Array.isArray(prescriptions)) {
		console.warn('Expected array of prescriptions, got:', typeof prescriptions);
		return [];
	}

	return prescriptions
		.filter((prescription) => prescription != null) // Filter out null/undefined
		.map((prescription) => {
			try {
				return adaptPrescriptionToTableData(prescription);
			} catch (error) {
				console.error('Error adapting prescription:', error, prescription);
				// Return a fallback object for invalid prescriptions
				return {
					prescriptionId: prescription?.prescriptionId || 0,
					patientName: formatPatientName(prescription) || 'Error: Invalid prescription',
					patientRut: prescription?.patientRut || 0,
					medication: 'Unknown',
					prescriptionDate: 'Unknown',
					status: 'active',
					rawData: prescription,
				};
			}
		});
};
