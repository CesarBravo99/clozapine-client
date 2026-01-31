import { createFileRoute } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { useSelector } from 'react-redux'
import { adaptPrescriptionsToTableData, getPrescriptionsByUser } from '@/api/prescriptions'
import { Sidebar } from '@/components/layout/Sidebar'
import { PrescriptionsTable } from '@/modules/prescriptions/components'
import { LeftSidebar } from '@/modules/prescriptions/components/LeftSidebar'
import {
  PrescriptionsProvider,
  usePrescriptionsContext,
} from '@/modules/prescriptions/contexts/PrescriptionsContext'
import { PrescriptionDetailDialog } from '@/modules/prescriptions/dialog'
import { usePrescriptions } from '@/modules/prescriptions/hooks/usePrescriptions'
import { langs } from '@/modules/prescriptions/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/prescriptions')({
  component: RouteComponent,
  loader: async ({ context }) => {
    console.log('💊 PRESCRIPTIONS LOADER: Started')

    const { store, queryClient, axiosClient } = context
    const state = store.getState()

    // Check if user is actually logged in first
    const isLoggedIn = state.session?.isLoggedIn
    if (!isLoggedIn) {
      console.log('⚠️ PRESCRIPTIONS LOADER: User not logged in, skipping data fetch')
      return {
        prescriptions: [],
        error: null,
        userRut: null,
      }
    }

    // Get user RUT from session
    const userRut = state.session?.userRut

    // If no user RUT available
    if (!userRut) {
      console.log('⚠️ PRESCRIPTIONS LOADER: No user RUT available')
      return {
        prescriptions: [],
        error: null,
        userRut: null,
      }
    }

    try {
      console.log('📊 PRESCRIPTIONS LOADER: Fetching for user:', userRut)

      const prescriptionsResponse = await queryClient.ensureQueryData({
        queryKey: ['prescriptions', userRut],
        queryFn: () => getPrescriptionsByUser(userRut, axiosClient),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
      })

      // Adapt the data to table format
      const adaptedData = adaptPrescriptionsToTableData(prescriptionsResponse)

      console.log('✅ PRESCRIPTIONS LOADER: Data fetched successfully')
      return {
        prescriptions: adaptedData,
        error: null,
        userRut: userRut,
      }
    } catch (error) {
      console.error('❌ PRESCRIPTIONS LOADER: Failed to fetch prescriptions:', error)

      // Don't throw error - return error state instead
      return {
        prescriptions: [],
        error: 'Failed to load prescriptions. Please try again.',
        userRut: userRut,
      }
    }
  },
})

function RouteComponent() {
  const { prescriptions, error, userRut } = Route.useLoaderData()
  const { prescriptions: currentPrescriptions, loading, refetch } = usePrescriptions(prescriptions)

  const handleRefresh = () => {
    if (userRut) {
      refetch(async () => {
        const response = await getPrescriptionsByUser(userRut, {} as any)
        return adaptPrescriptionsToTableData(response)
      })
    }
  }

  return (
    <PrescriptionsProvider
      initialPrescriptions={currentPrescriptions}
      onRefresh={handleRefresh}
      loading={loading}
      error={error}
    >
      <PrescriptionsContent userRut={userRut} />
    </PrescriptionsProvider>
  )
}

function PrescriptionsContent({ userRut }: { userRut: number | null }) {
  const { filteredPrescriptions, prescriptions, statusFilter, loading, error, handleRefresh } =
    usePrescriptionsContext()
  const lang = useSelector(selectLang)

  console.log('💊 PRESCRIPTIONS COMPONENT: Rendering with data:', {
    userRut,
    prescriptionCount: prescriptions.length,
    filteredPrescriptions: filteredPrescriptions.length,
    statusFilter,
    loading,
    error,
  })

  return (
    <div className="base-container">
      <title>Recetas | Clozapina</title>
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0}>
            <LeftSidebar />
          </Sidebar>

          <main className="flex flex-col grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-7 w-7 text-gray-800 dark:text-white" />
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {langs[lang].prescriptions.title}
                  </h1>
                  {filteredPrescriptions.length !== prescriptions.length && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {langs[lang].prescriptions.filterCount
                        .replace('{filtered}', filteredPrescriptions.length.toString())
                        .replace('{total}', prescriptions.length.toString())}
                    </span>
                  )}
                </div>
                {userRut && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {langs[lang].prescriptions.userLabel} {userRut}
                    </span>
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      type="button"
                    >
                      {loading
                        ? langs[lang].prescriptions.refreshingButton
                        : langs[lang].prescriptions.refreshButton}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-700 dark:text-red-400">
                      {langs[lang].prescriptions.errorMessage}
                    </p>
                  </div>
                )}

                {!userRut && !error && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 dark:text-yellow-400">
                      {langs[lang].prescriptions.noUserSelected}
                    </p>
                  </div>
                )}

                {userRut && filteredPrescriptions.length === 0 && !loading && !error && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="text-blue-700 dark:text-blue-400">
                      {langs[lang].prescriptions.noFilteredPrescriptions}
                    </p>
                  </div>
                )}

                {userRut && <PrescriptionsTable data={filteredPrescriptions} isLoading={loading} />}
              </div>
            </div>
          </main>
        </div>
      </div>
      <PrescriptionDetailDialog />
    </div>
  )
}
