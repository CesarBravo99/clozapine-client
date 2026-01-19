export interface GroupedNotification {
  patient: string | null
  rut: string | null
  notifications: import('@/domain/notification.types').Notification[]
}

export interface GroupedNotifications {
  [date: string]: {
    [patientKey: string]: GroupedNotification
  }
}
