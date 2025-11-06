import { LanguageState } from '@/redux/settings/settings.types';
import { en, type PatientsLanguages } from './en';
import { es } from './es';

export const langs: Record<LanguageState, PatientsLanguages> = {
	[LanguageState.EN]: en,
	[LanguageState.ES]: es,
};
