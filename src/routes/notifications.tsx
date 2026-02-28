import { createFileRoute } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useSelector } from 'react-redux'
import {
  formatNotificationDate,
  getNotificationColor,
  getNotificationsByUser,
  getNotificationTypeText,
  groupNotificationsByDateAndPatient,
} from '@/api/notifications'
import { getPatientsByAffiliation } from '@/api/patients'
import type { PatientTableData } from '@/api/patients/types/patient.types'
import { Sidebar } from '@/components/layout/Sidebar'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { formatRut } from '@/lib/rut'
import { LeftSidebar, NotificationList, RightSidebar } from '@/modules/notifications/components'
import { NotificationProvider, useNotificationContext } from '@/modules/notifications/context'
import {
  AddAppointmentDialog,
  type AppointmentFormData,
} from '@/modules/notifications/dialogs/AddAppointmentDialog'
import {
  AddPatientDialog,
  type AddPatientFormData,
} from '@/modules/notifications/dialogs/AddPatientDialog'
import { NotificationDetailDialog } from '@/modules/notifications/dialogs/NotificationDetailDialog'
import { PatientDetailDialog } from '@/modules/notifications/dialogs/PatientDetailDialog'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/notifications')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { store, queryClient, axiosClient } = context
    const state = store.getState()

    const affiliationsRecord: Record<number, Affiliation> = state.user?.affiliations ?? {}
    const affiliations: Affiliation[] = Object.values(affiliationsRecord)

    let selectedAffiliationId = state.session?.selectedAffiliationId ?? -1
    if ((!selectedAffiliationId || selectedAffiliationId <= 0) && affiliations.length > 0) {
      selectedAffiliationId = affiliations[0].affiliationId
    }

    const isLoggedIn = state.session?.isLoggedIn
    if (!isLoggedIn) {
      console.log('⚠️ NOTIFICATIONS LOADER: User not logged in, skipping data fetch')
      return {
        notifications: [],
        error: null,
        userRut: null,
        patients: [] as PatientTableData[],
        affiliations,
        selectedAffiliationId,
      }
    }

    const userRut = state.session?.userRut || state.user?.user?.userRut
    if (!userRut) {
      console.log('⚠️ NOTIFICATIONS LOADER: No user data available yet')
      return {
        notifications: [],
        error: null,
        userRut: null,
        patients: [] as PatientTableData[],
        affiliations,
        selectedAffiliationId,
      }
    }

    let patients: PatientTableData[] = []
    if (selectedAffiliationId && selectedAffiliationId > 0) {
      try {
        patients = await queryClient.ensureQueryData({
          queryKey: ['patients', selectedAffiliationId],
          queryFn: () => getPatientsByAffiliation(selectedAffiliationId, axiosClient),
          staleTime: 1000 * 60 * 5,
        })
      } catch (patientError) {
        console.error('NOTIFICATIONS LOADER: Failed to fetch patients:', patientError)
        patients = []
      }
    }

    try {
      console.log('📊 NOTIFICATIONS LOADER: Fetching for user:', userRut)
      const notificationResponse = await queryClient.ensureQueryData({
        queryKey: ['notifications', userRut],
        queryFn: () => getNotificationsByUser(userRut, axiosClient),
        staleTime: 1000 * 60 * 2, // 2 minutes cache
      })
      console.log('✅ NOTIFICATIONS LOADER: Data fetched successfully')
      return {
        notifications: notificationResponse,
        error: null,
        userRut,
        patients,
        affiliations,
        selectedAffiliationId,
      }
    } catch (error) {
      console.error('NOTIFICATIONS LOADER: Failed to fetch notifications:', error)
      return {
        notifications: [],
        error: 'Failed to load notifications. Please try again.',
        userRut,
        patients,
        affiliations,
        selectedAffiliationId,
      }
    }
  },
})

function RouteComponent() {
  const { notifications, userRut, patients, affiliations } = Route.useLoaderData()

  if (!userRut) {
    console.warn('NOTIFICATIONS COMPONENT: Showing loading state (no userRut)')
    return (
      <NotificationProvider
        notifications={[]}
        patients={[]}
        affiliations={[]}
        currentUserRut={null}
      >
        <LoadingContent />
      </NotificationProvider>
    )
  }

  console.warn('NOTIFICATIONS COMPONENT: Showing main component for user:', userRut)

  return (
    <NotificationProvider
      notifications={notifications || []}
      patients={patients || []}
      affiliations={affiliations || []}
      currentUserRut={userRut}
    >
      <NotificationContent />
    </NotificationProvider>
  )
}

function LoadingContent() {
  const lang = useSelector(selectLang)

  return (
    <div className="base-container">
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0}>
            <LeftSidebar />
          </Sidebar>
          <main className="flex flex-col grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-7 w-7 text-gray-800 dark:text-white" />
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {langs[lang].notifications.title}
                  </h1>
                </div>
              </div>
              <div className="flex-1 p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {langs[lang].notifications.loadingText}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function NotificationContent() {
  const { error, userRut } = Route.useLoaderData()
  const lang = useSelector(selectLang)
  const {
    notifications: contextNotifications,
    filteredNotifications,
    pendingCount,
    handleViewNotificationDetails,
    handleViewPatientDetails,
    completeNotification,
    resetFilters,
    openAddEventDialog,
    selectedNotification,
    setNotificationDetailOpen,
    isNotificationDetailOpen,
    selectedPatient,
    setPatientDetailOpen,
    isPatientDetailOpen,
    isAddAppointmentOpen,
    setAddAppointmentOpen,
    isAddPatientOpen,
    setAddPatientOpen,
    affiliations,
  } = useNotificationContext()

  console.warn('NOTIFICATIONS COMPONENT: Rendering with data:', {
    totalNotifications: contextNotifications.length,
    filteredNotifications: filteredNotifications.length,
    error,
    userRut,
  })

  const formatDate = (dateString: string) => formatNotificationDate(dateString, lang)
  const getTypeText = (type: number, isPassive?: boolean) =>
    getNotificationTypeText(type, lang, isPassive)

  const groupedNotifications = groupNotificationsByDateAndPatient(filteredNotifications)

  const handleAddPatientSubmit = (data: AddPatientFormData) => {
    console.log('ADD PATIENT form submitted:', data)
    setAddPatientOpen(false)
  }

  const handleAddAppointmentSubmit = (data: AppointmentFormData & { patientRut?: number }) => {
    console.log('APPOINTMENT scheduled:', data)
    setAddAppointmentOpen(false)
  }

  return (
    <div className="base-container">
      <title>Notificaciones | Clozapina</title>
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={pendingCount}>
            <LeftSidebar />
          </Sidebar>

          <main className="flex flex-col grow min-w-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-7 w-7 text-gray-800 dark:text-white" />
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {langs[lang].notifications.title}
                  </h1>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {langs[lang].notifications.userLabel} {formatRut(userRut?.toString() || '')}
                </span>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-700 dark:text-red-400">
                      {langs[lang].notifications.errorMessage}
                    </p>
                  </div>
                )}

                <NotificationList
                  groupedNotifications={groupedNotifications}
                  handleViewNotificationDetails={handleViewNotificationDetails}
                  handleViewPatientDetails={handleViewPatientDetails}
                  completeNotification={completeNotification}
                  resetFilters={resetFilters}
                  formatDate={formatDate}
                  getNotificationColor={getNotificationColor}
                  getNotificationTypeText={getTypeText}
                  openAddEventDialog={openAddEventDialog}
                />
              </div>
            </div>
          </main>

          <div className="hidden lg:block lg:w-70 shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>

      <NotificationDetailDialog
        open={isNotificationDetailOpen}
        onOpenChange={setNotificationDetailOpen}
        notification={selectedNotification}
        patient={selectedPatient}
        onCompleteNotification={completeNotification}
        onViewPatient={(patientRut, patientName) =>
          handleViewPatientDetails(patientRut, patientName ?? undefined)
        }
        onScheduleAppointment={openAddEventDialog}
      />

      <PatientDetailDialog
        open={isPatientDetailOpen}
        onOpenChange={setPatientDetailOpen}
        patient={selectedPatient}
        patientNotifications={contextNotifications}
        onScheduleAppointment={() => {
          setPatientDetailOpen(false)
          setAddAppointmentOpen(true)
        }}
      />

      <AddAppointmentDialog
        open={isAddAppointmentOpen}
        onOpenChange={setAddAppointmentOpen}
        patient={selectedPatient}
        onAddEvent={handleAddAppointmentSubmit}
      />

      <AddPatientDialog
        open={isAddPatientOpen}
        onOpenChange={setAddPatientOpen}
        onAddPatient={handleAddPatientSubmit}
        affiliations={affiliations}
      />
    </div>
  )
}
