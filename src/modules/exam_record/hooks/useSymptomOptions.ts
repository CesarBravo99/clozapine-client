import { useExamRecordContext } from '@/modules/exam_record/contexts/ExamRecordContext'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/exam_record/lang'

export function useSymptomOptions() {
  const { overview } = useExamRecordContext()
  const lang = useSelector(selectLang)
  const symptomText = langs[lang].symptomLabels

  return (
    overview?.symptoms.map((symptom) => ({
      ...symptom,
      label: symptomText[symptom.id] ?? symptom.label,
    })) ?? []
  )
}
