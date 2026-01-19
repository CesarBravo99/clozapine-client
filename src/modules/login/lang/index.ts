import { LanguageState } from '@/redux/settings/settings.types'
import { en, type AppLanguages } from './en'
import { es } from './es'

export const langs: Record<LanguageState, AppLanguages> = {
  [LanguageState.EN]: en,
  [LanguageState.ES]: es,
}
