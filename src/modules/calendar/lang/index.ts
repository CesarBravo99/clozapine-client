import { en, type CalendarModuleTranslations } from './en';
import { es } from './es';

export type { CalendarModuleTranslations } from './en';

export const langs: Record<'en' | 'es', CalendarModuleTranslations> = {
	en,
	es,
};

