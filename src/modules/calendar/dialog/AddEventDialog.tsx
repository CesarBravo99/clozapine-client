import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import axiosClient from '@/api/axiosClient'
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
import { useCalendarContext } from '@/modules/calendar/contexts'
import { langs } from '@/modules/calendar/lang'
import { selectLang } from '@/redux/settings/settings.slice'

interface Patient {
  rut: string
  firstName: string
  lastName: string
}

export function AddEventDialog() {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.addEvent
  const { isAddEventOpen, setAddEventOpen, newEventForm, updateNewEventForm, createEvent } =
    useCalendarContext()

  const { data: patientsData = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async (): Promise<Patient[]> => {
      const response = await axiosClient.get('api/v1/patients/select_options')
      return response.data
    },
    enabled: isAddEventOpen,
  })

  return (
    <Dialog open={isAddEventOpen} onOpenChange={setAddEventOpen}>
      <DialogContent className="sm:max-w-136">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={newEventForm.title}
              onChange={(event) => updateNewEventForm({ title: event.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={newEventForm.date}
                onChange={(event) => updateNewEventForm({ date: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={newEventForm.time}
                onChange={(event) => updateNewEventForm({ time: event.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select
                value={newEventForm.patientRut}
                onValueChange={(value) => {
                  const patient = patientsData.find((p) => p.rut === value)
                  if (patient) {
                    updateNewEventForm({
                      patientRut: patient.rut,
                      patientName: `${patient.firstName} ${patient.lastName}`,
                    })
                  } else {
                    updateNewEventForm({ patientRut: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patientsData.map((patient) => (
                    <SelectItem key={patient.rut} value={patient.rut}>
                      {`${patient.firstName} ${patient.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duración (min)</Label>
              <Input
                type="number"
                min={15}
                step={15}
                value={newEventForm.durationMinutes}
                onChange={(event) =>
                  updateNewEventForm({ durationMinutes: Number(event.target.value) })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre paciente</Label>
              <Input
                value={newEventForm.patientName}
                onChange={(event) => updateNewEventForm({ patientName: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={newEventForm.patientPhone}
                onChange={(event) => updateNewEventForm({ patientPhone: event.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Médico</Label>
            <Input
              value={newEventForm.doctorName}
              onChange={(event) => updateNewEventForm({ doctorName: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea
              value={newEventForm.notes}
              onChange={(event) => updateNewEventForm({ notes: event.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAddEventOpen(false)}>
            {text.cancel}
          </Button>
          <Button className="btn-color-common" onClick={createEvent}>
            {text.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
