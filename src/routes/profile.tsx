import { createFileRoute } from '@tanstack/react-router'
import { Check, Settings, Shield, User, X } from 'lucide-react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { adaptUserProfileToDisplayData, getUserProfile } from '@/api/profile'
import { Sidebar } from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import {
  ContactInfoSection,
  LeftSidebar,
  PasswordChangeForm,
  PersonalInfoSection,
  PreferencesSection,
  SecurityForm,
} from '@/modules/profile/components'
import { ProfileProvider, type ProfileTab, useProfileContext } from '@/modules/profile/context'
import { AffiliationSelectorDialog } from '@/modules/profile/dialog'
import { langs } from '@/modules/profile/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/profile')({
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
        profile: null,
        rawProfile: null,
        error: null,
        userRut: null,
        affiliations,
        selectedAffiliationId,
      }
    }

    const userRut = state.session?.userRut
    if (!userRut) {
      return {
        profile: null,
        rawProfile: null,
        error: null,
        userRut: null,
        affiliations,
        selectedAffiliationId,
      }
    }

    try {
      const profileResponse = await queryClient.ensureQueryData({
        queryKey: ['profile', userRut],
        queryFn: () => getUserProfile(axiosClient),
        staleTime: 1000 * 60 * 10,
        retry: false,
      })

      const adaptedData = adaptUserProfileToDisplayData(profileResponse)

      return {
        profile: adaptedData,
        rawProfile: profileResponse,
        error: null,
        userRut,
        affiliations,
        selectedAffiliationId,
      }
    } catch (error) {
      return {
        profile: null,
        rawProfile: null,
        error: error instanceof Error ? error.message : 'Failed to load profile. Please try again.',
        userRut,
        affiliations,
        selectedAffiliationId,
      }
    }
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const { profile, error, userRut, affiliations, selectedAffiliationId } = loaderData

  if (!userRut) {
    return <ProfileLoadingContent />
  }

  return (
    <ProfileProvider
      profile={profile}
      userRut={userRut}
      affiliations={affiliations || []}
      selectedAffiliationId={selectedAffiliationId ?? -1}
    >
      <ProfileContent error={error} />
    </ProfileProvider>
  )
}

interface ProfileContentProps {
  error: string | null
}

function ProfileContent({ error }: ProfileContentProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang]
  const {
    profile,
    userRut,
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    contactInfo,
    updateContactInfo,
    handleSaveContactInfo,
    isSavingContactInfo,
    fontSize,
    setFontSize,
    notificationPreferences,
    setNotificationPreference,
    handleSaveNotificationPreferences,
    isSavingPreferences,
    affiliations,
    selectedAffiliationId,
    setSelectedAffiliation,
    isAffiliationDialogOpen,
    setAffiliationDialogOpen,
    successMessage,
    hideSuccessMessage,
  } = useProfileContext()

  const tabs = useMemo(
    () => [
      { id: 'personal' as ProfileTab, label: text.components.tabs.personal, icon: User },
      { id: 'security' as ProfileTab, label: text.components.tabs.security, icon: Shield },
      {
        id: 'preferences' as ProfileTab,
        label: text.components.tabs.preferences,
        icon: Settings,
      },
    ],
    [text.components.tabs.personal, text.components.tabs.preferences, text.components.tabs.security]
  )

  if (!profile || !userRut) {
    return <ProfileLoadingContent />
  }

  const currentAffiliation =
    profile.affiliations.find((item) => item.id === selectedAffiliationId) ??
    profile.affiliations[0] ??
    null

  return (
    <div className="base-container">
      <title>Perfil | Clozapina</title>
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0}>
            <LeftSidebar collapsed={sidebarCollapsed} />
          </Sidebar>

          <main className="flex flex-col grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <User className="size-7 text-gray-800 dark:text-white" />
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {text.page.title}
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    {currentAffiliation && (
                      <Badge variant="outline">{currentAffiliation.position}</Badge>
                    )}
                    {userRut && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {text.page.userLabel} {userRut}
                      </span>
                    )}
                  </div>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as ProfileTab)}
                >
                  <TabsList className="grid w-full grid-cols-3 mb-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <TabsTrigger key={tab.id} value={tab.id}>
                          <Icon className="mr-2 size-4" />
                          {tab.label}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as ProfileTab)}
                >
                  <TabsContent value="personal">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <PersonalInfoSection
                        profile={profile}
                        currentAffiliationName={currentAffiliation?.position ?? null}
                        onChangeAffiliation={() => setAffiliationDialogOpen(true)}
                      />
                      <ContactInfoSection
                        email={contactInfo.email}
                        phone={contactInfo.phone}
                        onChange={(field, value) =>
                          updateContactInfo(field === 'email' ? { email: value } : { phone: value })
                        }
                        onSave={handleSaveContactInfo}
                        isSaving={isSavingContactInfo}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="security">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                          {text.components.securitySummary.title}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {text.components.securitySummary.role}
                            </span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {profile.credentials.role}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {text.components.securitySummary.lastLogin}
                            </span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {profile.credentials.lastLogin}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {text.components.securitySummary.passwordChanged}
                            </span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {profile.credentials.passwordChanged
                                ? text.components.securitySummary.yes
                                : text.components.securitySummary.no}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {text.components.securitySummary.accountCreated}
                            </span>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {profile.credentials.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                          <SecurityForm userRut={userRut} profile={profile} />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                          <PasswordChangeForm userRut={userRut} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                      <PreferencesSection
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        notificationPreferences={notificationPreferences}
                        setNotificationPreference={setNotificationPreference}
                        onSave={handleSaveNotificationPreferences}
                        isSaving={isSavingPreferences}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AffiliationSelectorDialog
        open={isAffiliationDialogOpen}
        onOpenChange={setAffiliationDialogOpen}
        selectedAffiliationId={selectedAffiliationId}
        onSelectAffiliation={(id) => {
          setSelectedAffiliation(id)
          setAffiliationDialogOpen(false)
        }}
        affiliations={affiliations}
      />

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check className="size-4" />
          <span>{successMessage}</span>
          <button type="button" onClick={hideSuccessMessage} className="text-white/80 text-sm">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileLoadingContent() {
  const lang = useSelector(selectLang)
  const text = langs[lang]

  return (
    <div className="base-container">
      <div className="flex flex-col space-y-8 h-full">
        <div className="flex gap-6 h-full">
          <Sidebar pendingCount={0} />
          <main className="flex flex-col grow">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col">
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">{text.page.loading}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
