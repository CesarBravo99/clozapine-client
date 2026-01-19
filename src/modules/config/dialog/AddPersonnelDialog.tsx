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

const INITIAL_FORM: PersonnelFormData = {
  name: '',
  role: '',
  rut: '',
  email: '',
  phone: '',
  status: 'active',
}

export function AddPersonnelDialog() {
  const lang = useSelector(selectLang)
  const { addPersonnel, form } = useAddPersonnelLogic()
  const text = langs[lang].dialogs

  return (
    <Dialog open={form.isOpen} onOpenChange={form.setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{text.addPersonnel.title}</DialogTitle>
          <DialogDescription>{text.addPersonnel.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{text.form.name}</Label>
              <Input
                id="name"
                value={form.values.name}
                onChange={(event) => form.update({ name: event.target.value })}
                placeholder={text.form.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rut">{text.form.rut}</Label>
              <Input
                id="rut"
                value={form.values.rut}
                onChange={(event) => form.update({ rut: event.target.value })}
                placeholder={text.form.rut}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">{text.form.role}</Label>
              <Select
                value={form.values.role}
                onValueChange={(value) => form.update({ role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder={text.form.role} />
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
              <Label htmlFor="status">{text.form.status}</Label>
              <Select
                value={form.values.status}
                onValueChange={(value) =>
                  form.update({ status: value as PersonnelFormData['status'] })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={text.form.status} />
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
            <Label htmlFor="email">{text.form.email}</Label>
            <Input
              id="email"
              type="email"
              value={form.values.email}
              onChange={(event) => form.update({ email: event.target.value })}
              placeholder={text.form.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{text.form.phone}</Label>
            <Input
              id="phone"
              value={form.values.phone}
              onChange={(event) => form.update({ phone: event.target.value })}
              placeholder={text.form.phone}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => form.setOpen(false)}>
            {text.addPersonnel.cancel}
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={addPersonnel}>
            {text.addPersonnel.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function useAddPersonnelLogic() {
  const { isAddPersonnelDialogOpen, setAddPersonnelDialogOpen, handleAddPersonnel } =
    useConfigContext()
  const [values, setValues] = useState<PersonnelFormData>(INITIAL_FORM)

  useEffect(() => {
    if (!isAddPersonnelDialogOpen) {
      setValues(INITIAL_FORM)
    }
  }, [isAddPersonnelDialogOpen])

  const update = (partial: Partial<PersonnelFormData>) => {
    setValues((prev) => ({ ...prev, ...partial }))
  }

  const addPersonnel = () => {
    handleAddPersonnel(values)
    setValues(INITIAL_FORM)
  }

  return {
    addPersonnel,
    form: {
      values,
      update,
      isOpen: isAddPersonnelDialogOpen,
      setOpen: setAddPersonnelDialogOpen,
    },
  }
}
