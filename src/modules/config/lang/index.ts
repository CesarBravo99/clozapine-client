import { en, type ConfigModuleTranslations } from './en'
import { es } from './es'

export type { ConfigModuleTranslations } from './en'

export const langs: Record<'en' | 'es', ConfigModuleTranslations> = {
  en,
  es,
}
