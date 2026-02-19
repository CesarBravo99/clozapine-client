import { useSelector } from 'react-redux'
import { useExamRecordFormContext } from '@/modules/exam_record/form_contexts/ExamRecordFormContext'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function useSymptomOptions() {
  const { overview } = useExamRecordFormContext()
  const lang = useSelector(selectLang)
  const symptomText = langs[lang].symptomLabels

  return (
    overview?.symptoms.map((symptom) => ({
      ...symptom,
      label: symptomText[symptom.id] ?? symptom.label,
    })) ?? []
  )
}
