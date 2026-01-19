import { LanguageState } from '@/redux/settings/settings.types'
import { en, type ExamRecordTranslations } from './en'
import { es } from './es'

export const langs: Record<LanguageState, ExamRecordTranslations> = {
  [LanguageState.EN]: en,
  [LanguageState.ES]: es,
}

export type { ExamRecordTranslations } from './en'
