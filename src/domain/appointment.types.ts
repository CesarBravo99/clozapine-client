export interface Appointment {
  // Server information
  readonly appointmentId: number
  readonly notificationId: number
  readonly affiliationId: number
  readonly patientRut: number
  readonly patientPhone: string
  readonly patientEmail: string
  readonly userRut: number
  readonly title: string
  readonly date: string | Date
  readonly duration: number
  readonly start: string | Date
  readonly end: string | Date
  readonly type: AppointmentType
  readonly status: AppointmentStatus
  readonly notes?: string

  // frontend use
  readonly patientName: string
  readonly patientPhoneFormatted: string
  readonly patientEmailFormatted: string
  readonly userNameFormatted: string
  readonly userEmailFormatted: string
  readonly appointmentFullName: string
  readonly appointmentFullNameFormatted: string
  readonly appointmentAgeFormatted: string
  readonly appointmentBirthdayFormatted: string
  readonly color?: string
}

export enum AppointmentType {
  PatientControl = 0,
  Evaluation = 1,
  Urgency = 2,
}

export enum AppointmentStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3,
  Missed = 4,
}

export interface AppointmentMetadata {
  readonly taskCompleted: boolean
  readonly completedBy: number | null
  readonly completedAt: string | null
  readonly details: AppointmentDetails
}

export interface AppointmentDetails {
  readonly appointmentType: AppointmentType
  readonly appointmentStatus: AppointmentStatus
}
