import type { AffiliationPermissions } from '@/domain/auth/permissions.types';

export interface ServerCredentials {
	userRut: number;
	userRole: number;
	userPermissions: AffiliationPermissions[];
	createdAt: string;
	updatedAt: string;
	lastLogin: string;
}
