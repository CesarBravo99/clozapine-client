import type { ServerCredentials } from '@/api/auth/types/creds.types';
import type { Credentials } from '@/domain/auth/creds.types';
import type { AffiliationPermissions } from '@/domain/auth/permissions.types';

export function adaptCredentials(serverCredentials: ServerCredentials): Credentials {
	return {
		userRut: serverCredentials.userRut,
		userRole: serverCredentials.userRole,
		userPermissions: adaptPermissions(serverCredentials.userPermissions),
		createdAt: serverCredentials.createdAt,
		updatedAt: serverCredentials.updatedAt,
		lastLogin: serverCredentials.lastLogin,
	};
}

function adaptPermissions(serverPermissions: AffiliationPermissions[]): Record<number, AffiliationPermissions> {
	const permissions: Record<number, AffiliationPermissions> = {};
	serverPermissions.forEach((permission: AffiliationPermissions) => {
		permissions[permission.affiliationId] = permission;
	});
	return permissions;
}
