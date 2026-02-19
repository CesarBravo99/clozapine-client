import { useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useExamRecordForm,
  useExamRecordFormContext,
} from '@/modules/exam_record/form_contexts/ExamRecordFormContext'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function PersonalInfoCard() {
  const { overview } = useExamRecordFormContext()
  const form = useExamRecordForm()
  const lang = useSelector(selectLang)
  const text = langs[lang]

  if (!overview) {
    return null
  }

  const fieldText = text.sections.fields

  return (
    <Card className="border border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {text.sections.personalInfo}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field name="patient.fullName">
            {(field: { state: { value: string } }) => (
              <ReadOnlyField label={fieldText.firstName} value={field.state.value} />
            )}
          </form.Field>
          <form.Field name="patient.lastName">
            {(field: { state: { value: string } }) => (
              <ReadOnlyField label={fieldText.lastName} value={field.state.value} />
            )}
          </form.Field>
          <form.Field name="patient.rut">
            {(field: { state: { value: string } }) => (
              <ReadOnlyField label={fieldText.rut} value={field.state.value} />
            )}
          </form.Field>
          <form.Field name="patient.age">
            {(field: { state: { value: string } }) => (
              <ReadOnlyField label={fieldText.age} value={field.state.value} />
            )}
          </form.Field>
          <form.Field name="patient.birthDate">
            {(field: { state: { value: string } }) => (
              <ReadOnlyField label={fieldText.birthDate} value={field.state.value} />
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {text.sections.ancestryQuestion}
          </Label>
          <form.Field name="patient.ancestryAnswer">
            {(field: { state: { value: string } }) => (
              <Input
                value={formatAncestryAnswer(
                  field.state.value,
                  text.sections.ancestryYes,
                  text.sections.ancestryNo
                )}
                disabled
                className="bg-gray-50 dark:bg-gray-800/40"
              />
            )}
          </form.Field>
        </div>
      </CardContent>
    </Card>
  )
}

interface ReadOnlyFieldProps {
  label: string
  value: string
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="">{label}</Label>
      <Input value={value} disabled className="bg-gray-50 dark:bg-gray-800/40" />
    </div>
  )
}

function formatAncestryAnswer(answer: string, yesText: string, noText: string) {
  const normalized = answer?.toLowerCase().trim()
  const positiveValues = new Set(['si', 'sí', 'yes', 'true', '1'])
  if (normalized && positiveValues.has(normalized)) {
    return yesText
  }
  return noText
}
