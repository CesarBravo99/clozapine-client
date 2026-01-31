import { createFileRoute } from '@tanstack/react-router'
import { Check, Laptop, User, UserCog, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getHelpOverview } from '@/api/help'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeveloperForm, HeroSection, PatientForm, StaffForm } from '@/modules/help/components'
import { useHelpContext } from '@/modules/help/contexts'
import { langs } from '@/modules/help/lang'
import { HelpProvider } from '@/modules/help/providers'
import { selectLang } from '@/redux/settings/settings.slice'

interface HelpLoaderData {
  help: Awaited<ReturnType<typeof getHelpOverview>>
  user: {
    isAuthenticated: boolean
    name: string | null
    email: string | null
  }
}

export const Route = createFileRoute('/help')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { store, axiosClient } = context
    const state = store.getState()
    const userDomain = state.user?.user
    const session = state.session

    const selectedAffiliationId = session?.selectedAffiliationId ?? null
    const help = await getHelpOverview(session?.userRut ?? null, selectedAffiliationId, axiosClient)

    const userAffiliations = userDomain?.userAffiliations ?? {}
    const selectedAffiliation =
      (selectedAffiliationId && userAffiliations[selectedAffiliationId]) ||
      Object.values(userAffiliations)[0] ||
      null
    const affiliationEmail = selectedAffiliation?.userEmail ?? null

    const user = {
      isAuthenticated: Boolean(session?.isLoggedIn),
      name: userDomain?.userNameFormatted ?? null,
      email: affiliationEmail,
    }

    return { help, user } satisfies HelpLoaderData
  },
})

function RouteComponent() {
  const { help, user } = Route.useLoaderData() as HelpLoaderData

  return (
    <HelpProvider helpData={help} user={user}>
      <HelpContent />
    </HelpProvider>
  )
}

function HelpContent() {
  const lang = useSelector(selectLang)
  const text = langs[lang]
  const { activeTab, setActiveTab, successMessage, hideSuccessMessage } = useHelpContext()

  const tabItems = [
    {
      id: 'patient',
      label: text.tabs.patient,
      icon: User,
      className:
        'data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-600 dark:text-blue-300',
      bannerClass: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    },
    {
      id: 'staff',
      label: text.tabs.staff,
      icon: UserCog,
      className:
        'data-[state=active]:bg-cyan-500 dark:data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-cyan-600 dark:text-cyan-300',
      bannerClass: 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-100',
    },
    {
      id: 'developer',
      label: text.tabs.developer,
      icon: Laptop,
      className:
        'data-[state=active]:bg-pink-500 dark:data-[state=active]:bg-pink-500 data-[state=active]:text-white text-pink-600 dark:text-pink-300',
      bannerClass: 'bg-pink-50 dark:bg-pink-900/30 text-pink-800 dark:text-pink-100',
    },
  ]

  return (
    <div className="py-6 px-4 md:px-10">
      <title>Ayuda | Clozapina</title>
      <div className="max-w-5xl mx-auto space-y-8">
        <HeroSection />
        <Card className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-md">
          <CardHeader>
            <CardTitle>{text.page.title}</CardTitle>
            <CardDescription>{text.page.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <TabsList className="w-full grid grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg gap-1">
                {tabItems.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`rounded-md text-sm sm:text-base font-medium transition flex items-center justify-center gap-2 px-3 py-2 ${tab.className}`}
                    >
                      <Icon className="size-4" />
                      {tab.label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              <TabsContent value="patient" className="space-y-4">
                <div className={`p-4 rounded-lg text-sm ${tabItems[0].bannerClass}`}>
                  {text.components.banners.patient}
                </div>
                <PatientForm />
              </TabsContent>
              <TabsContent value="staff" className="space-y-4">
                <div className={`p-4 rounded-lg text-sm ${tabItems[1].bannerClass}`}>
                  {text.components.banners.staff}
                </div>
                <StaffForm />
              </TabsContent>
              <TabsContent value="developer" className="space-y-4">
                <div className={`p-4 rounded-lg text-sm ${tabItems[2].bannerClass}`}>
                  {text.components.banners.developer}
                </div>
                <DeveloperForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <Check className="size-4" />
          <span>{successMessage}</span>
          <button type="button" onClick={hideSuccessMessage} className="text-white/80">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
