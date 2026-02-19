import { useExamRecordFormContext } from '@/modules/exam_record/form_contexts/ExamRecordFormContext'

export function useDocumentRequirements() {
  const { overview } = useExamRecordFormContext()
  return overview?.documents ?? []
}
