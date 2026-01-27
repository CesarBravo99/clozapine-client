import { Phone, UserPlus } from 'lucide-react'
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
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export interface AddPatientFormData {
  patientRut: string
  firstName: string
  lastName: string
  email: string
  phone: string
  birthday: string
  affiliationId: number | null
  notes: string
}

interface AddPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (patient: AddPatientFormData) => void
  affiliations: Affiliation[]
}

const DEFAULT_FORM: AddPatientFormData = {
  patientRut: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: '',
  affiliationId: null,
  notes: '',
}

export function AddPatientDialog({
  open,
  onOpenChange,
  onAddPatient,
  affiliations,
}: AddPatientDialogProps) {
  const [form, setForm] = useState<AddPatientFormData>(DEFAULT_FORM)
  const [error, setError] = useState<string | null>(null)
  const lang = useSelector(selectLang)
  const dictionary = langs[lang].dialogs.addPatient

  const handleClose = (value: boolean) => {
    if (!value) {
      setForm(DEFAULT_FORM)
      setError(null)
    }
    onOpenChange(value)
  }

  const handleSubmit = () => {
    if (
      !form.patientRut.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.affiliationId
    ) {
      setError(dictionary.errorRequired)
      return
    }

    onAddPatient(form)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>{dictionary.title}</DialogTitle>
          <DialogDescription>{dictionary.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-2 md:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <UserPlus className="h-4 w-4" />
              {dictionary.personalSectionTitle}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="patient-rut">{dictionary.rutLabel}</Label>
                <Input
                  id="patient-rut"
                  placeholder={dictionary.rutPlaceholder}
                  value={form.patientRut}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, patientRut: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-first-name">{dictionary.firstNameLabel}</Label>
                <Input
                  id="patient-first-name"
                  placeholder={dictionary.firstNamePlaceholder}
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-last-name">{dictionary.lastNameLabel}</Label>
                <Input
                  id="patient-last-name"
                  placeholder={dictionary.lastNamePlaceholder}
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-birthday">{dictionary.birthdayLabel}</Label>
                <Input
                  id="patient-birthday"
                  type="date"
                  value={form.birthday}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, birthday: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4" />
              {dictionary.contactSectionTitle}
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="patient-email">{dictionary.emailLabel}</Label>
                <Input
                  id="patient-email"
                  type="email"
                  placeholder={dictionary.emailPlaceholder}
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-phone">{dictionary.phoneLabel}</Label>
                <Input
                  id="patient-phone"
                  placeholder={dictionary.phonePlaceholder}
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>{dictionary.affiliationLabel}</Label>
                <Select
                  value={form.affiliationId ? String(form.affiliationId) : undefined}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, affiliationId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.affiliationPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {affiliations.length === 0 && (
                      <SelectItem value="0" disabled>
                        {dictionary.noAffiliations}
                      </SelectItem>
                    )}
                    {affiliations.map((affiliation) => (
                      <SelectItem
                        key={affiliation.affiliationId}
                        value={String(affiliation.affiliationId)}
                      >
                        {affiliation.affiliationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-notes">{dictionary.notesLabel}</Label>
                <Textarea
                  id="patient-notes"
                  placeholder={dictionary.notesPlaceholder}
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  className="min-h-25"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => handleClose(false)}>
            {dictionary.cancel}
          </Button>
          <Button onClick={handleSubmit}>{dictionary.confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
