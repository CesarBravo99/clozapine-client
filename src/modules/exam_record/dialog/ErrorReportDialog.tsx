import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useExamRecordFormContext } from '@/modules/exam_record/form_contexts/ExamRecordFormContext'
import { langs } from '@/modules/exam_record/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function ErrorReportDialog() {
  const { overview, isErrorDialogOpen, setErrorDialogOpen, reportError, isReportingError } =
    useExamRecordFormContext()
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.errorReport
  const [rut, setRut] = useState('')
  const [errorType, setErrorType] = useState('data')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    reportError(rut || overview?.patient.rut || '', errorType, description)
  }

  return (
    <Dialog open={isErrorDialogOpen} onOpenChange={setErrorDialogOpen}>
      <DialogContent className="sm:max-w-108">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{text.title}</DialogTitle>
            <DialogDescription>{text.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="error-rut">{text.fields.rut}</Label>
            <Input
              id="error-rut"
              value={rut}
              onChange={(event) => setRut(event.target.value)}
              placeholder={overview?.patient.rut}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="error-type">{text.fields.errorType}</Label>
            <Select value={errorType} onValueChange={setErrorType}>
              <SelectTrigger id="error-type">
                <SelectValue placeholder={text.fields.errorType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data">{text.typeOptions.data}</SelectItem>
                <SelectItem value="page">{text.typeOptions.page}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="error-description">{text.fields.description}</Label>
            <Textarea
              id="error-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={text.placeholder}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setErrorDialogOpen(false)}>
              {text.buttons.cancel}
            </Button>
            <Button type="submit" disabled={isReportingError}>
              {text.buttons.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
