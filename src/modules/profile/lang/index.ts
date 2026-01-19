import { en, type ProfileModuleTranslations } from './en'
import { es } from './es'

export type { ProfileModuleTranslations } from './en'

export const langs: Record<'en' | 'es', ProfileModuleTranslations> = {
  en,
  es,
}
