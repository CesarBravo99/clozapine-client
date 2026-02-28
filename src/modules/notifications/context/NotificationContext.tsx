import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import axiosClient from '@/api/axiosClient'
import {
  completeNotification as completeNotificationApi,
  sortNotificationsByDateAndPriority,
} from '@/api/notifications'
import type { PatientTableData } from '@/api/patients/types/patient.types'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import type { Notification, NotificationMetadata } from '@/domain/notification.types'
import { NotificationType } from '@/domain/notification.types'
import { useMediaQuery } from '@/hooks/use-media-query'
import { formatRut } from '@/lib/rut'

const TYPE_KEY_TO_VALUE: Record<string, NotificationType> = {
  urgente: NotificationType.Urgency,
  importante: NotificationType.Important,
  recordatorio: NotificationType.Suggestion,
  normal: NotificationType.Normal,
  solicitud: NotificationType.Request,
}

const DEFAULT_METADATA: NotificationMetadata = {
  taskCompleted: false,
  completedBy: null,
  completedAt: null,
  details: {
    affiliationRequest: false,
    newAffiliationId: null,
    oldAffiliationId: null,
  },
}

const ensureMetadata = (metadata?: NotificationMetadata): NotificationMetadata => {
  if (!metadata) {
    return DEFAULT_METADATA
  }

  return {
    taskCompleted: metadata.taskCompleted ?? false,
    completedBy: metadata.completedBy ?? null,
    completedAt: metadata.completedAt ?? null,
    details: metadata.details ?? DEFAULT_METADATA.details,
  }
}

export interface NotificationPatientSummary {
  patientRut: number
  fullName: string | null
  lastControl?: string | null
  state?: string | null
  rutFormatted: string | null
  raw?: PatientTableData
}

interface NotificationContextType {
  // Filter state
  selectedDate: string
  setSelectedDate: (date: string) => void
  filterByRut: boolean
  setFilterByRut: (value: boolean) => void
  rutFilter: string
  setRutFilter: (value: string) => void
  showPendingOnly: boolean
  setShowPendingOnly: (value: boolean) => void
  selectedType: string
  setSelectedType: (type: string) => void

  // Notifications data
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  filteredNotifications: Notification[]
  pendingCount: number
  notificationPatients: Record<number, NotificationPatientSummary>

  // UI state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean) => void
  isExtraSmallScreen: boolean

  // Actions
  resetFilters: () => void
  handleRutChange: (value: string) => void

  // Dialog state
  selectedNotification: Notification | null
  setSelectedNotification: (notification: Notification | null) => void
  isNotificationDetailOpen: boolean
  setNotificationDetailOpen: (open: boolean) => void

  selectedPatient: NotificationPatientSummary | null
  setSelectedPatient: (patient: NotificationPatientSummary | null) => void
  isPatientDetailOpen: boolean
  setPatientDetailOpen: (open: boolean) => void

  isAddAppointmentOpen: boolean
  setAddAppointmentOpen: (open: boolean) => void

  isAddPatientOpen: boolean
  setAddPatientOpen: (open: boolean) => void

  // Notification actions
  handleViewNotificationDetails: (notification: Notification) => void
  handleViewPatientDetails: (patientRut: number, patientName?: string) => void
  completeNotification: (id: string, notes?: string) => Promise<void>
  openAddEventDialog: (patientRut?: number) => void

  // Left sidebar actions
  handleAddPatient: () => void
  handleSearchPatient: () => void

  // External data
  patients: NotificationPatientSummary[]
  resolvePatientSummary: (notification: Notification) => NotificationPatientSummary | null
  affiliations: Affiliation[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
  notifications: Notification[]
  patients?: PatientTableData[]
  affiliations?: Affiliation[]
  currentUserRut?: number | null
}

export function NotificationProvider({
  children,
  notifications,
  patients = [],
  affiliations = [],
  currentUserRut = null,
}: NotificationProviderProps) {
  // Filter state
  const [selectedDate, setSelectedDate] = useState('')
  const [filterByRut, setFilterByRut] = useState(false)
  const [rutFilter, setRutFilter] = useState('')
  const [showPendingOnly, setShowPendingOnly] = useState(false)
  const [selectedType, setSelectedType] = useState('all')

  // Notifications state
  const [allNotifications, setAllNotifications] = useState<Notification[]>(() =>
    sortNotificationsByDateAndPriority(notifications)
  )

  useEffect(() => {
    setAllNotifications(sortNotificationsByDateAndPriority(notifications))
  }, [notifications])

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isExtraSmallScreen = useMediaQuery('(max-width: 640px)')
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')

  useEffect(() => {
    setSidebarCollapsed(isExtraSmallScreen || isSmallScreen)
  }, [isExtraSmallScreen, isSmallScreen])

  // Dialog state
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isNotificationDetailOpen, setNotificationDetailOpen] = useState(false)

  const mapPatient = useCallback((patient: PatientTableData): NotificationPatientSummary => {
    return {
      patientRut: patient.patientRut,
      fullName: patient.name,
      lastControl: patient.lastControl,
      state: patient.state,
      rutFormatted: formatRut(patient.patientRut),
      raw: patient,
    }
  }, [])

  const [patientSummaries, setPatientSummaries] = useState<NotificationPatientSummary[]>(
    patients.map(mapPatient)
  )

  const [selectedPatient, setSelectedPatient] = useState<NotificationPatientSummary | null>(null)
  const [isPatientDetailOpen, setPatientDetailOpen] = useState(false)
  const [isAddAppointmentOpen, setAddAppointmentOpen] = useState(false)
  const [isAddPatientOpen, setAddPatientOpen] = useState(false)

  useEffect(() => {
    setPatientSummaries(patients.map(mapPatient))
  }, [patients, mapPatient])

  const findPatient = useCallback(
    (patientRut: number, fallbackName?: string | null): NotificationPatientSummary | null => {
      if (!patientRut) {
        return fallbackName
          ? {
              patientRut,
              fullName: fallbackName,
              lastControl: null,
              state: null,
              rutFormatted: formatRut(patientRut),
            }
          : null
      }

      const existing = patientSummaries.find((patient) => patient.patientRut === patientRut)

      if (existing) {
        return existing
      }

      return {
        patientRut,
        fullName: fallbackName ?? null,
        lastControl: null,
        state: null,
        rutFormatted: formatRut(patientRut),
      }
    },
    [patientSummaries]
  )

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((notification) => {
      // Date filter (compare date part only)
      if (selectedDate) {
        try {
          const notificationDate = new Date(notification.date).toISOString().split('T')[0]
          if (notificationDate !== selectedDate) {
            return false
          }
        } catch {
          // If parsing fails, fallback to string contains
          if (!String(notification.date).startsWith(selectedDate)) {
            return false
          }
        }
      }

      // RUT filter (patient or user RUT)
      if (filterByRut && rutFilter.trim()) {
        const cleanRut = rutFilter.replace(/[^\dKk]/g, '').toLowerCase()
        const patientRut = notification.patientRut ? String(notification.patientRut) : ''
        const userRut = notification.userRut ? String(notification.userRut) : ''

        const rutMatches =
          patientRut?.toLowerCase().includes(cleanRut) || userRut?.toLowerCase().includes(cleanRut)

        if (!rutMatches) {
          return false
        }
      }

      // Pending filter
      const metadata = ensureMetadata(notification.metadata)
      if (showPendingOnly && metadata.taskCompleted) {
        return false
      }

      // Type filter
      if (selectedType !== 'all') {
        const mappedType = TYPE_KEY_TO_VALUE[selectedType]
        if (mappedType !== undefined && notification.type !== mappedType) {
          return false
        }
      }

      return true
    })
  }, [allNotifications, filterByRut, rutFilter, selectedDate, selectedType, showPendingOnly])

  const pendingCount = useMemo(() => {
    return allNotifications.reduce((count, notification) => {
      return ensureMetadata(notification.metadata).taskCompleted ? count : count + 1
    }, 0)
  }, [allNotifications])

  const resetFilters = useCallback(() => {
    setSelectedDate('')
    setFilterByRut(false)
    setRutFilter('')
    setShowPendingOnly(false)
    setSelectedType('all')
  }, [])

  const handleRutChange = useCallback((value: string) => {
    setRutFilter(value)
  }, [])

  const handleViewNotificationDetails = useCallback(
    (notification: Notification) => {
      setSelectedNotification(notification)
      setNotificationDetailOpen(true)

      if (notification.patientRut) {
        const patient = findPatient(notification.patientRut, notification.patientName)
        setSelectedPatient(patient)
      }
    },
    [findPatient]
  )

  const handleViewPatientDetails = useCallback(
    (patientRut: number, patientName?: string) => {
      const patient = findPatient(patientRut, patientName ?? null)
      if (patient) {
        setSelectedPatient(patient)
        setPatientDetailOpen(true)
      }
    },
    [findPatient]
  )

  const completeNotification = useCallback(
    async (id: string, notes?: string) => {
      const payload = {
        notificationId: id,
        completedBy: currentUserRut ?? 0,
        notes: notes ?? '',
      }

      const updatedNotification = await completeNotificationApi(payload, axiosClient)

      setAllNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId === updatedNotification.notificationId
            ? updatedNotification
            : notification
        )
      )

      setSelectedNotification((prev) => {
        if (prev && prev.notificationId === updatedNotification.notificationId) {
          return updatedNotification
        }
        return prev
      })
    },
    [currentUserRut]
  )

  const openAddEventDialog = useCallback(
    (patientRut?: number) => {
      if (patientRut) {
        const patient = findPatient(patientRut)
        if (patient) {
          setSelectedPatient(patient)
        }
      }
      setAddAppointmentOpen(true)
    },
    [findPatient]
  )

  const handleAddPatient = useCallback(() => {
    setAddPatientOpen(true)
  }, [])

  const handleSearchPatient = useCallback(() => {
    console.log('Search patient action triggered')
  }, [])

  const notificationPatients = useMemo(() => {
    const map = new Map<number, NotificationPatientSummary>()

    for (const summary of patientSummaries) {
      map.set(summary.patientRut, summary)
    }

    allNotifications.forEach((notification) => {
      if (!notification.patientRut) {
        return
      }

      if (map.has(notification.patientRut)) {
        return
      }

      map.set(notification.patientRut, {
        patientRut: notification.patientRut,
        fullName: notification.patientName ?? null,
        lastControl: null,
        state: null,
        rutFormatted: formatRut(notification.patientRut),
      })
    })

    return map
  }, [allNotifications, patientSummaries])

  const resolvePatientSummary = useCallback(
    (notification: Notification): NotificationPatientSummary | null => {
      if (!notification.patientRut) {
        return notification.patientName
          ? {
              patientRut: 0,
              fullName: notification.patientName,
              lastControl: null,
              state: null,
              rutFormatted: null,
            }
          : null
      }

      const fromMap = notificationPatients.get(notification.patientRut)
      if (fromMap) {
        return fromMap
      }

      return {
        patientRut: notification.patientRut,
        fullName: notification.patientName ?? null,
        lastControl: null,
        state: null,
        rutFormatted: formatRut(notification.patientRut),
      }
    },
    [notificationPatients]
  )

  const value: NotificationContextType = {
    // Filter state
    selectedDate,
    setSelectedDate,
    filterByRut,
    setFilterByRut,
    rutFilter,
    setRutFilter,
    showPendingOnly,
    setShowPendingOnly,
    selectedType,
    setSelectedType,

    // Notifications data
    notifications: allNotifications,
    setNotifications: setAllNotifications,
    filteredNotifications,
    pendingCount,

    // UI state
    sidebarCollapsed,
    setSidebarCollapsed,
    isExtraSmallScreen,

    // Actions
    resetFilters,
    handleRutChange,

    // Dialog state
    selectedNotification,
    setSelectedNotification,
    isNotificationDetailOpen,
    setNotificationDetailOpen,
    selectedPatient,
    setSelectedPatient,
    isPatientDetailOpen,
    setPatientDetailOpen,
    isAddAppointmentOpen,
    setAddAppointmentOpen,
    isAddPatientOpen,
    setAddPatientOpen,

    // Notification actions
    handleViewNotificationDetails,
    handleViewPatientDetails,
    completeNotification,
    openAddEventDialog,

    // Left sidebar actions
    handleAddPatient,
    handleSearchPatient,

    // External data
    patients: patientSummaries,
    notificationPatients: Object.fromEntries(notificationPatients.entries()) as Record<
      number,
      NotificationPatientSummary
    >,
    resolvePatientSummary,
    affiliations,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
