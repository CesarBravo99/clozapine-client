import type { AxiosInstance } from 'axios';

export interface ValidateTokenData {
	rut: number;
	role: number;
}

export interface ValidateTokenResponse {
	valid: boolean;
	message: string;
}

export default async function validateToken(
	claims: ValidateTokenData,
	axiosClient: AxiosInstance
): Promise<ValidateTokenResponse> {
	return await axiosClient
		.get(`/validate-token?requestRut=${claims.rut}&requestRole=${claims.role}`)
		.then((response) => {
			return {
				valid: response.data.valid,
				message: response.data.message,
			};
		})
		.catch((error) => {
			console.error('Login failed:', error.message);
			throw error;
		});
}
