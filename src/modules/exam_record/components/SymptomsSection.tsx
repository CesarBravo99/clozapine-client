import { useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useExamRecordForm } from '@/modules/exam_record/form_contexts/ExamRecordFormContext'
import { useSymptomOptions } from '@/modules/exam_record/hooks/useSymptomOptions'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function SymptomsSection() {
  const options = useSymptomOptions()
  const form = useExamRecordForm()
  const lang = useSelector(selectLang)
  const text = langs[lang]

  return (
    <Card className="border border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {text.sections.symptoms}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{text.symptoms.instructions}</p>
        <form.Field name="symptoms">
          {(field: { state: { value: string[] }; handleChange: (value: string[]) => void }) => (
            <div className="space-y-2">
              {options.map((option) => (
                <label
                  key={option.id}
                  htmlFor={`symptom-option-${option.id}`}
                  className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                >
                  <Checkbox
                    id={`symptom-option-${option.id}`}
                    checked={field.state.value.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.handleChange([...field.state.value, option.id])
                      } else {
                        field.handleChange(field.state.value.filter((s) => s !== option.id))
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </form.Field>
        <div className="space-y-1.5 mt-3">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {text.sections.notesLabel}
          </Label>
          <form.Field name="notes">
            {(field: { state: { value: string }; handleChange: (value: string) => void }) => (
              <Textarea
                id="notes"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={text.symptoms.otherSymptomsLabel}
                className="min-h-25"
              />
            )}
          </form.Field>
        </div>
      </CardContent>
    </Card>
  )
}
