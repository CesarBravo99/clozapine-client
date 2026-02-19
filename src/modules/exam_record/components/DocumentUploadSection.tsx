import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useExamRecordForm } from '@/modules/exam_record/form_contexts/ExamRecordFormContext'
import { useDocumentRequirements } from '@/modules/exam_record/hooks/useDocumentRequirements'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function DocumentUploadSection() {
  const requirements = useDocumentRequirements()
  const form = useExamRecordForm()
  const lang = useSelector(selectLang)
  const text = langs[lang]

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const triggerUpload = (id: string) => {
    const ref = inputRefs.current[id]
    if (ref) {
      ref.click()
    }
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {text.sections.documents}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form.Field name="documents">
          {(field: {
            state: { value: Record<string, string> }
            handleChange: (value: Record<string, string>) => void
          }) => (
            <>
              {requirements.map((req) => {
                const uploaded = field.state.value[req.id]
                return (
                  <div
                    key={req.id}
                    className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30 flex flex-col gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {req.label}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{req.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {text.documents.formatsPrefix}: {req.supportedTypes.join(', ')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => triggerUpload(req.id)}
                    >
                      {text.documents.uploadCta}
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => {
                        inputRefs.current[req.id] = el
                      }}
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          field.handleChange({ ...field.state.value, [req.id]: file.name })
                        }
                      }}
                    />
                    {uploaded && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {text.documents.uploadedLabel}: {uploaded}
                      </p>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </form.Field>
      </CardContent>
    </Card>
  )
}
