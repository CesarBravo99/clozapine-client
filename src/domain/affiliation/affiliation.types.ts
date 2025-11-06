import type { AffiliationSettings } from './affiliation-settings.types';

export interface Affiliation {
	readonly affiliationId: number;
	readonly affiliationName: string;
	readonly shortName: string;
	readonly supportPhone: string;
	readonly supportEmail: string;
	readonly affiliationSettings: AffiliationSettings;
	readonly paidStatus: boolean;
}
