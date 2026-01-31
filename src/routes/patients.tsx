import { createFileRoute } from '@tanstack/react-router'
import { Users2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getPatientsByAffiliation } from '@/api/patients'
import { Sidebar } from '@/components/layout/Sidebar'
import { PatientsTable } from '@/modules/patients/components'
import { LeftSidebar } from '@/modules/patients/components/LeftSidebar'
import { PatientsProvider, usePatients } from '@/modules/patients/context/PatientsContext'
import { AddPatientListDialog } from '@/modules/patients/dialogs/AddPatientListDialog'
import { PatientDetailsDialog } from '@/modules/patients/dialogs/PatientDetailsDialog'
import { usePatients as usePatientData } from '@/modules/patients/hooks/usePatients'
import { langs } from '@/modules/patients/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/patients')({
  component: RouteComponent,
  loader: async ({ context }) => {
    console.log('👥 PATIENTS LOADER: Started')

    const { store, queryClient, axiosClient } = context
    const state = store.getState()

    // Check if user is actually logged in first
    const isLoggedIn = state.session?.isLoggedIn
    if (!isLoggedIn) {
      console.log('⚠️ PATIENTS LOADER: User not logged in, skipping data fetch')
      return {
        patients: [],
        error: null,
        affiliationId: null,
      }
    }

    // Get selected affiliation ID from session
    const selectedAffiliationId = state.session?.selectedAffiliationId

    // If no affiliation selected, this might be during initial load
    if (!selectedAffiliationId || selectedAffiliationId === -1) {
      console.log('⚠️ PATIENTS LOADER: No affiliation selected yet')
      return {
        patients: [],
        error: null,
        affiliationId: null,
      }
    }

    try {
      console.log('📊 PATIENTS LOADER: Fetching for affiliation:', selectedAffiliationId)

      const patientsResponse = await queryClient.ensureQueryData({
        queryKey: ['patients', selectedAffiliationId],
        queryFn: () => getPatientsByAffiliation(selectedAffiliationId, axiosClient),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
      })

      console.log('✅ PATIENTS LOADER: Data fetched successfully')
      return {
        patients: patientsResponse,
        error: null,
        affiliationId: selectedAffiliationId,
      }
    } catch (error) {
      console.error('❌ PATIENTS LOADER: Failed to fetch patients:', error)

      // Don't throw error - return error state instead
      return {
        patients: [],
        error: 'Failed to load patients. Please try again.',
        affiliationId: selectedAffiliationId,
      }
    }
  },
})

function RouteComponent() {
  const { patients, error, affiliationId } = Route.useLoaderData()
  const { patients: currentPatients, loading, refetch } = usePatientData(patients)

  const handleRefresh = () => {
    if (affiliationId) {
      refetch(() => getPatientsByAffiliation(affiliationId, {} as any))
    }
  }

  return (
    <PatientsProvider
      initialPatients={currentPatients}
      onRefresh={handleRefresh}
      loading={loading}
      error={error}
    >
      <PatientsContent affiliationId={affiliationId} />
    </PatientsProvider>
  )
}

function PatientsContent({ affiliationId }: { affiliationId: number | null }) {
  const { filteredPatients, patients, filterType, loading, error, handleRefresh } = usePatients()
  const lang = useSelector(selectLang)

  console.log('👥 PATIENTS COMPONENT: Rendering with data:', {
    affiliationId,
    patientCount: patients.length,
    filteredPatients: filteredPatients.length,
    filterType,
    loading,
    error,
  })

  return (
    <div className="base-container">
      <title>Pacientes | Clozapina</title>
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0}>
            <LeftSidebar />
          </Sidebar>

          <main className="flex flex-col grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <Users2 className="h-7 w-7 text-gray-800 dark:text-white" />
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {langs[lang].patients.title}
                  </h1>
                  {filteredPatients.length !== patients.length && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {langs[lang].patients.filterCount
                        .replace('{filtered}', filteredPatients.length.toString())
                        .replace('{total}', patients.length.toString())}
                    </span>
                  )}
                </div>
                {affiliationId && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {langs[lang].patients.affiliationLabel} {affiliationId}
                    </span>
                    <button
                      onClick={handleRefresh}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={loading}
                      type="button"
                    >
                      {loading
                        ? langs[lang].patients.refreshingButton
                        : langs[lang].patients.refreshButton}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-700 dark:text-red-400">
                      {langs[lang].patients.errorMessage}
                    </p>
                  </div>
                )}

                {!affiliationId && !error && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 dark:text-yellow-400">
                      {langs[lang].patients.noAffiliationSelected}
                    </p>
                  </div>
                )}

                {affiliationId && filteredPatients.length === 0 && !loading && !error && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <p className="text-blue-700 dark:text-blue-400">
                      {langs[lang].patients.noFilteredPatients}
                    </p>
                  </div>
                )}

                {affiliationId && <PatientsTable data={filteredPatients} isLoading={loading} />}
              </div>
            </div>
          </main>
        </div>

        <PatientDetailsDialog />
        <AddPatientListDialog />
      </div>
    </div>
  )
}
