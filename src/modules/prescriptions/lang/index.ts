import { LanguageState } from '@/redux/settings/settings.types';
import { en, type PrescriptionsLanguages } from './en';
import { es } from './es';

export const langs: Record<LanguageState, PrescriptionsLanguages> = {
	[LanguageState.EN]: en,
	[LanguageState.ES]: es,
};
