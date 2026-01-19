import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouteContext } from '@tanstack/react-router'
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  format,
} from 'date-fns'
import { selectLang } from '@/redux/settings/settings.slice'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEventStatus,
  type CalendarEvent,
  type CalendarEventPayload,
  type CalendarOverview,
  type CalendarEventStatus,
} from '@/api/calendar'
import { langs } from '@/modules/calendar/lang'
import {
  CalendarContext,
  type CalendarContextValue,
  type CalendarEventForm,
  type CalendarView,
} from '../contexts/CalendarContext'

interface CalendarProviderProps {
  children: ReactNode
  calendarData: CalendarOverview | null
  userRut: number
  selectedAffiliationId: number
  affiliations: Affiliation[]
}

const DEFAULT_EVENT_FORM: CalendarEventForm = {
  title: 'Nueva cita',
  date: format(new Date(), 'yyyy-MM-dd'),
  time: '10:00',
  durationMinutes: 30,
  patientName: '',
  patientRut: '',
  patientPhone: '',
  doctorName: '',
  notes: '',
  status: 'pending',
}

export function CalendarProvider({
  children,
  calendarData,
  userRut,
  selectedAffiliationId,
  affiliations,
}: CalendarProviderProps) {
  const routeContext = useRouteContext({ from: '__root__' })
  const { axiosClient } = routeContext
  const lang = useSelector(selectLang)
  const text = langs[lang] ?? langs.es

  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<CalendarView>('week')
  const [events, setEvents] = useState<CalendarEvent[]>(calendarData?.events ?? [])
  const [patients, setPatients] = useState(calendarData?.patients ?? [])

  useEffect(() => {
    setEvents(calendarData?.events ?? [])
    setPatients(calendarData?.patients ?? [])
  }, [calendarData])

  const isExtraSmallScreen = useMediaQuery('(max-width: 640px)')
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setSidebarCollapsed(isExtraSmallScreen || isSmallScreen)
  }, [isExtraSmallScreen, isSmallScreen])

  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, index) => addDays(start, index))
  }, [date])

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const interval = {
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: startOfWeek(addWeeks(monthEnd, 1), { weekStartsOn: 1 }),
    }
    return eachDayOfInterval(interval)
  }, [date])

  const workingHours = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 8), [])

  const handleNext = useCallback(() => {
    if (view === 'day') setDate((prev) => addDays(prev, 1))
    else if (view === 'week') setDate((prev) => addWeeks(prev, 1))
    else setDate((prev) => addMonths(prev, 1))
  }, [view])

  const handlePrevious = useCallback(() => {
    if (view === 'day') setDate((prev) => subDays(prev, 1))
    else if (view === 'week') setDate((prev) => subWeeks(prev, 1))
    else setDate((prev) => subMonths(prev, 1))
  }, [view])

  const handleToday = useCallback(() => setDate(new Date()), [])

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isAddEventOpen, setAddEventOpen] = useState(false)
  const [isEventDetailsOpen, setEventDetailsOpen] = useState(false)
  const [isAffiliationDialogOpen, setAffiliationDialogOpen] = useState(false)

  const [newEventForm, setNewEventForm] = useState<CalendarEventForm>(DEFAULT_EVENT_FORM)

  const updateNewEventForm = (partial: Partial<CalendarEventForm>) => {
    setNewEventForm((prev) => ({ ...prev, ...partial }))
  }

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const hideSuccessMessage = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
    setSuccessMessage(null)
  }, [])

  const showSuccessMessage = useCallback((message: string) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }
    setSuccessMessage(message)
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage(null)
      successTimeoutRef.current = null
    }, 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const getEventsByDate = useCallback(
    (day: Date) => events.filter((event) => isSameDay(new Date(event.start), day)),
    [events]
  )

  const handleTimeSlotSelection = useCallback((day: Date, time: string) => {
    updateNewEventForm({
      date: format(day, 'yyyy-MM-dd'),
      time,
    })
    setAddEventOpen(true)
  }, [])

  const buildPayload = (): CalendarEventPayload => ({
    title: newEventForm.title || 'Consulta',
    date: newEventForm.date,
    time: newEventForm.time,
    durationMinutes: newEventForm.durationMinutes,
    patientName: newEventForm.patientName,
    patientRut: newEventForm.patientRut,
    patientPhone: newEventForm.patientPhone,
    doctorName: newEventForm.doctorName || 'Sin asignar',
    notes: newEventForm.notes,
    status: newEventForm.status,
  })

  const createEvent = useCallback(async () => {
    const payload = buildPayload()
    setAddEventOpen(false)
    setNewEventForm((prev) => ({ ...DEFAULT_EVENT_FORM, doctorName: prev.doctorName }))

    try {
      const created = await createCalendarEvent(selectedAffiliationId, payload, axiosClient)
      setEvents((prev) => [...prev, created])
      showSuccessMessage(text.messages.eventCreated)
    } catch (error) {
      console.error('Failed to create calendar event', error)
    }
  }, [
    axiosClient,
    selectedAffiliationId,
    showSuccessMessage,
    text.messages.eventCreated,
    newEventForm,
  ])

  const updateEventStatus = useCallback(
    async (status: CalendarEventStatus) => {
      if (!selectedEvent) return
      setEvents((prev) =>
        prev.map((event) => (event.id === selectedEvent.id ? { ...event, status } : event))
      )
      setEventDetailsOpen(false)
      showSuccessMessage(text.messages.eventStatusUpdated)

      try {
        await updateCalendarEventStatus(
          selectedAffiliationId,
          selectedEvent.id,
          status,
          axiosClient
        )
      } catch (error) {
        console.error('Failed to update event status', error)
      }
    },
    [
      axiosClient,
      selectedEvent,
      selectedAffiliationId,
      showSuccessMessage,
      text.messages.eventStatusUpdated,
    ]
  )

  const deleteEvent = useCallback(async () => {
    if (!selectedEvent) return
    const eventId = selectedEvent.id
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setEventDetailsOpen(false)
    setSelectedEvent(null)
    showSuccessMessage(text.messages.eventDeleted)

    try {
      await deleteCalendarEvent(selectedAffiliationId, eventId, axiosClient)
    } catch (error) {
      console.error('Failed to delete event', error)
    }
  }, [
    axiosClient,
    selectedAffiliationId,
    selectedEvent,
    showSuccessMessage,
    text.messages.eventDeleted,
  ])

  const value: CalendarContextValue = {
    date,
    view,
    setView,
    handleNext,
    handlePrevious,
    handleToday,
    weekDays,
    monthDays,
    workingHours,
    events,
    getEventsByDate,
    selectedEvent,
    setSelectedEvent,
    isAddEventOpen,
    setAddEventOpen,
    isEventDetailsOpen,
    setEventDetailsOpen,
    isAffiliationDialogOpen,
    setAffiliationDialogOpen,
    newEventForm,
    updateNewEventForm,
    handleTimeSlotSelection,
    createEvent,
    updateEventStatus,
    deleteEvent,
    patients,
    sidebarCollapsed,
    isExtraSmallScreen,
    successMessage,
    showSuccessMessage,
    hideSuccessMessage,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}
