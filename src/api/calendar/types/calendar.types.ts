export type CalendarEventStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface CalendarEvent {
  id: string
  title: string
  start: string // ISO date string
  end: string // ISO date string
  patientName: string
  patientRut: string
  patientPhone: string
  doctorName: string
  notes?: string
  status: CalendarEventStatus
}

export interface CalendarPatientSummary {
  rut: string
  name: string
  phone: string
  lastAppointment?: string
}

export interface CalendarOverview {
  events: CalendarEvent[]
  patients: CalendarPatientSummary[]
}

export interface CalendarEventPayload {
  title: string
  date: string
  time: string
  durationMinutes: number
  patientName: string
  patientRut: string
  patientPhone: string
  doctorName: string
  notes?: string
  status?: CalendarEventStatus
}
