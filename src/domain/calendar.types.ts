export type CalendarViewType = 'month' | 'week' | 'day'

export interface CalendarFilter {
  readonly type: string
  readonly label: string
  readonly color?: string
}

export interface CalendarSettings {
  readonly defaultView: CalendarViewType
  readonly showWeekends: boolean
  readonly workingHours: {
    readonly start: number
    readonly end: number
  }
  readonly firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
}
