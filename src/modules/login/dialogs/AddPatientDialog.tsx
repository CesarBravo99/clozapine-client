import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext'
import { langs } from '@/modules/login/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function AddPatientDialog() {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.addPatient
  const [showOtherHospital, setShowOtherHospital] = useState(false)
  const { addPatientOpen, setAddPatientOpen } = useLoginDialogContext()

  const handleHospitalChange = (value: string) => {
    setShowOtherHospital(value === 'other')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">{text.fields.name}</Label>
            <Input id="patient-name" placeholder={text.placeholders.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-rut">{text.fields.rut}</Label>
            <Input id="patient-rut" placeholder={text.placeholders.rut} required />
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="patient-email">{text.fields.email}</Label>
            <Input id="patient-email" type="email" placeholder={text.placeholders.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-phone">{text.fields.phone}</Label>
            <Input id="patient-phone" type="tel" placeholder={text.placeholders.phone} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-hospital">{text.fields.hospital}</Label>
            <Select onValueChange={handleHospitalChange}>
              <SelectTrigger id="patient-hospital">
                <SelectValue placeholder={text.placeholders.hospital} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curico">{text.hospitals.curico}</SelectItem>
                <SelectItem value="san-juan">{text.hospitals.sanJuan}</SelectItem>
                <SelectItem value="other">{text.hospitals.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showOtherHospital && (
            <div className="space-y-2">
              <Label htmlFor="patient-other-hospital">{text.fields.otherHospital}</Label>
              <Input id="patient-other-hospital" placeholder={text.placeholders.otherHospital} />
            </div>
          )}
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {text.buttons.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {text.buttons.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
