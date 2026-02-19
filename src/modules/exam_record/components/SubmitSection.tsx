import { AlertTriangle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useExamRecordContext } from '@/modules/exam_record/contexts/ExamRecordContext'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function SubmitSection() {
  const lang = useSelector(selectLang)
  const text = langs[lang]
  const { submitExamRecord, isSubmitting, setErrorDialogOpen } = useExamRecordContext()

  return (
    <div className="space-y-4">
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">{text.alerts.submitWarning}</AlertDescription>
      </Alert>
      <div className="flex flex-row gap-3 justify-end">
        <Button variant="outline" onClick={() => setErrorDialogOpen(true)}>
          {text.buttons.errorReport}
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 min-w-48 text-white px-5"
          onClick={submitExamRecord}
          disabled={isSubmitting}
        >
          {isSubmitting ? text.buttons.submitting : text.buttons.submit}
        </Button>
      </div>
    </div>
  )
}
