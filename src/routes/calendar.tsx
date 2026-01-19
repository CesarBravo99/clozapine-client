import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { format } from 'date-fns'
import { getCalendarOverview, type CalendarOverview } from '@/api/calendar'
import { CalendarProvider } from '@/modules/calendar/providers'
import { useCalendarContext } from '@/modules/calendar/contexts'
import { LeftSidebar, DayView, WeekView, MonthView } from '@/modules/calendar/components'
import {
  AddEventDialog,
  EventDetailsDialog,
  AffiliationSelectorDialog,
} from '@/modules/calendar/dialog'
import { langs } from '@/modules/calendar/lang'
import { setSelectedAffiliationId } from '@/redux/session/session.slice'

interface LoaderResult {
  calendar: CalendarOverview | null
  error: string | null
  userRut: number | null
  affiliations: Affiliation[]
  selectedAffiliationId: number
}

export const Route = createFileRoute('/calendar')({
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
      return {
        calendar: null,
        error: null,
        userRut: null,
        affiliations,
        selectedAffiliationId,
      } satisfies LoaderResult
    }

    const userRut = state.session?.userRut
    if (!userRut) {
      return {
        calendar: null,
        error: null,
        userRut: null,
        affiliations,
        selectedAffiliationId,
      } satisfies LoaderResult
    }

    try {
      const calendar = await queryClient.ensureQueryData({
        queryKey: ['calendar', userRut, selectedAffiliationId],
        queryFn: () => getCalendarOverview(userRut, selectedAffiliationId, axiosClient),
        staleTime: 1000 * 60 * 5,
      })

      return {
        calendar,
        error: null,
        userRut,
        affiliations,
        selectedAffiliationId,
      } satisfies LoaderResult
    } catch (error) {
      console.error('Failed to load calendar data', error)
      return {
        calendar: null,
        error: 'No se pudo cargar el calendario. Intente nuevamente.',
        userRut,
        affiliations,
        selectedAffiliationId,
      } satisfies LoaderResult
    }
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData() as LoaderResult
  const { calendar, error, userRut, affiliations, selectedAffiliationId } = loaderData

  if (!userRut) {
    return <CalendarLoading />
  }

  return (
    <CalendarProvider
      calendarData={calendar}
      userRut={userRut}
      selectedAffiliationId={selectedAffiliationId}
      affiliations={affiliations}
    >
      <CalendarContent
        error={error}
        affiliations={affiliations}
        selectedAffiliationId={selectedAffiliationId}
      />
    </CalendarProvider>
  )
}

interface CalendarContentProps {
  error: string | null
  affiliations: Affiliation[]
  selectedAffiliationId: number
}

function CalendarContent({ error, affiliations, selectedAffiliationId }: CalendarContentProps) {
  const lang = useSelector(selectLang)
  const dispatch = useDispatch()
  const text = langs[lang]
  const {
    date,
    view,
    setView,
    handleNext,
    handlePrevious,
    handleToday,
    sidebarCollapsed,
    successMessage,
    hideSuccessMessage,
    setAddEventOpen,
    isAffiliationDialogOpen,
    setAffiliationDialogOpen,
  } = useCalendarContext()

  const tabs = useMemo(
    () => [
      { id: 'day', label: text.page.viewLabels.day },
      { id: 'week', label: text.page.viewLabels.week },
      { id: 'month', label: text.page.viewLabels.month },
    ],
    [text.page.viewLabels.day, text.page.viewLabels.month, text.page.viewLabels.week]
  )

  const renderView = () => {
    if (view === 'day') return <DayView />
    if (view === 'week') return <WeekView />
    return <MonthView />
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-10 h-full">
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0}>
            <LeftSidebar collapsed={sidebarCollapsed} />
          </Sidebar>
          <main className="flex flex-col flex-grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {text.page.title}
                  </h1>
                  <Badge variant="outline" className="flex items-center gap-1 cursor-pointer">
                    <CalendarIcon className="h-4 w-4" />
                    <button type="button" onClick={() => setAffiliationDialogOpen(true)}>
                      Sucursal
                    </button>
                  </Badge>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-lg font-semibold min-w-[180px] text-center">
                      {format(date, 'PPPP')}
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleToday}>
                      {text.page.today}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
                      <TabsList>
                        {tabs.map((tab) => (
                          <TabsTrigger key={tab.id} value={tab.id}>
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => setAddEventOpen(true)}
                    >
                      {text.page.addEvent}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}
                {renderView()}
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddEventDialog />
      <EventDetailsDialog />
      <AffiliationSelectorDialog
        open={isAffiliationDialogOpen}
        onOpenChange={setAffiliationDialogOpen}
        affiliations={affiliations}
        selectedAffiliationId={selectedAffiliationId}
        onSelect={(id) => {
          dispatch(setSelectedAffiliationId(id))
          setAffiliationDialogOpen(false)
        }}
      />

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check className="h-4 w-4" />
          <span>{successMessage}</span>
          <button type="button" onClick={hideSuccessMessage} className="text-white/80 text-sm">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

function CalendarLoading() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-10 h-full">
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0} />
          <main className="flex flex-col flex-grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Cargando calendario…</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
