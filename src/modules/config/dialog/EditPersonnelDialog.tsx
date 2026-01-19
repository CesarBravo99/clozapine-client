import { useEffect, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/config/lang'
import { useConfigContext, type PersonnelFormData } from '@/modules/config/contexts'

export function EditPersonnelDialog() {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs
  const {
    isEditPersonnelDialogOpen,
    setEditPersonnelDialogOpen,
    selectedPersonnel,
    handleEditPersonnel,
  } = useConfigContext()

  const [values, setValues] = useState<PersonnelFormData>({
    id: undefined,
    name: '',
    role: '',
    rut: '',
    email: '',
    phone: '',
    status: 'active',
  })

  useEffect(() => {
    if (isEditPersonnelDialogOpen && selectedPersonnel) {
      setValues(selectedPersonnel)
    }
  }, [isEditPersonnelDialogOpen, selectedPersonnel])

  const update = (partial: Partial<PersonnelFormData>) => {
    setValues((prev) => ({ ...prev, ...partial }))
  }

  const handleSubmit = () => {
    handleEditPersonnel(values)
  }

  return (
    <Dialog open={isEditPersonnelDialogOpen} onOpenChange={setEditPersonnelDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{text.editPersonnel.title}</DialogTitle>
          <DialogDescription>{text.editPersonnel.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 ">
              <Label htmlFor="edit-name">{text.form.name}</Label>
              <Input
                id="edit-name"
                value={values.name}
                onChange={(event) => update({ name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rut">{text.form.rut}</Label>
              <Input
                id="edit-rut"
                value={values.rut}
                onChange={(event) => update({ rut: event.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">{text.form.role}</Label>
              <Select value={values.role} onValueChange={(value) => update({ role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Médico">{text.form.roleOptions.doctor}</SelectItem>
                  <SelectItem value="Enfermero/a">{text.form.roleOptions.nurse}</SelectItem>
                  <SelectItem value="Recepcionista">
                    {text.form.roleOptions.receptionist}
                  </SelectItem>
                  <SelectItem value="Administrador">{text.form.roleOptions.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">{text.form.status}</Label>
              <Select
                value={values.status}
                onValueChange={(value) => update({ status: value as PersonnelFormData['status'] })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{text.form.statusOptions.active}</SelectItem>
                  <SelectItem value="inactive">{text.form.statusOptions.inactive}</SelectItem>
                  <SelectItem value="pending">{text.form.statusOptions.pending}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">{text.form.email}</Label>
            <Input
              id="edit-email"
              type="email"
              value={values.email}
              onChange={(event) => update({ email: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">{text.form.phone}</Label>
            <Input
              id="edit-phone"
              value={values.phone}
              onChange={(event) => update({ phone: event.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setEditPersonnelDialogOpen(false)}>
            {text.editPersonnel.cancel}
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSubmit}>
            {text.editPersonnel.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
