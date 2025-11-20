import { en, type HelpModuleTranslations } from './en';
import { es } from './es';

export type { HelpModuleTranslations } from './en';

export const langs: Record<'en' | 'es', HelpModuleTranslations> = {
	en,
	es,
};

