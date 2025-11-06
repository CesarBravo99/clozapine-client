import type { AxiosInstance } from 'axios';
import type { ServerUserAffiliation, ServerUser } from './types/user.types';

export interface ValidateUserData {
	rut: number;
	role: number;
}

export interface ValidateUserResponse {
	affiliations: Map<number, ServerUserAffiliation>;
	user: ServerUser;
}

export default async function validateUser(
	data: ValidateUserData,
	axiosClient: AxiosInstance
): Promise<ValidateUserResponse> {
	return await axiosClient
		.get(`/validate?requestRut=${data.rut}&requestRole=${data.role}`)
		.then((response) => {
			const affiliationData: [number, ServerUserAffiliation][] = [];
			response.data.affiliations.forEach((affiliation: ServerUserAffiliation) => {
				affiliationData.push([affiliation.affiliationId, affiliation]);
			});
			const affiliations = new Map(affiliationData);
			const user = response.data.user;

			return {
				affiliations,
				user,
			};
		})
		.catch((error) => {
			console.error('Login failed:', error.message);
			throw error;
		});
}
