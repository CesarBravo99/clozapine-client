import type { AxiosInstance } from 'axios';
import type { PrescriptionAPIResponse } from './types/prescription.types';

export const getPrescriptionsByUser = async (
	userRut: number,
	axiosClient: AxiosInstance
): Promise<PrescriptionAPIResponse[]> => {
	const response = await axiosClient.get(`/api/v1/prescriptions/user/${userRut}`);
	return response.data;
};

// Export adapter functions
export {
	adaptPrescriptionsToTableData,
	adaptPrescriptionToTableData,
	formatMedicationInfo,
	formatPrescriptionDate,
	formatPatientName,
	mapPrescriptionStatusToString,
} from './adapters/prescription.adapter';
