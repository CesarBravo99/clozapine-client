import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, User, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatientForm } from '@/modules/login/components/PatientForm'
import { UserForm } from '@/modules/login/components/UserForm'
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext'
import {
  AddPatientDialog,
  AddUserDialog,
  AffiliationChangeDialog,
  ForgotPasswordDialog,
} from '@/modules/login/dialogs'
import { langs } from '@/modules/login/lang'
import { LoginDialogProvider } from '@/modules/login/providers/LoginDialogProvider'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LoginDialogProvider>
      <LoginPage />
      <LoginDialogs />
    </LoginDialogProvider>
  )
}

function LoginPage() {
  const lang = useSelector(selectLang)
  const [userType, setUserType] = useState('patient')
  const { setAddPatientOpen, setAffiliationOpen, setForgotPasswordOpen, setAddUserOpen } =
    useLoginDialogContext()
  const patientLinks = langs[lang].userForm.links.patient
  const personalLinks = langs[lang].userForm.links.personal

  return (
    <main className="container max-w-lg flex flex-col justify-center mx-auto py-[11vh]">
      <title>Login | Clozapina</title>
      <div
        className="rounded-2xl shadow-xl 
          bg-white dark:bg-gray-900 
          border border-gray-200 dark:border-gray-700"
      >
        <div className="px-8 py-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            {langs[lang].userForm.title}
          </h2>
          <div className="flex flex-col gap-4">
            <Tabs
              defaultValue="patient"
              className="w-full"
              onValueChange={(value) => setUserType(value as 'patient' | 'personal')}
            >
              <TabsList className="grid w-full grid-cols-2 rounded-md pb-3 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="patient"
                  className="rounded-md py-2 text-md
                    data-[state=active]:bg-blue-500 
                    dark:data-[state=active]:bg-blue-500 
                    data-[state=active]:text-white 
                    data-[state=active]:shadow-sm"
                >
                  <User className="mr-2" />
                  {langs[lang].userForm.patientLabel}
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="rounded-md text-md
                    data-[state=active]:bg-cyan-500 
                    dark:data-[state=active]:bg-cyan-500
                    data-[state=active]:text-white 
                    data-[state=active]:shadow-sm"
                >
                  <UserCog className="mr-2" />
                  {langs[lang].userForm.userLabel}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {userType === 'patient' ? (
              <>
                <PatientForm />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal text-sm text-blue-600 dark:text-blue-400"
                    onClick={() => setAddPatientOpen(true)}
                  >
                    {patientLinks.register}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal text-sm text-blue-600 dark:text-blue-400"
                    onClick={() => setAffiliationOpen(true)}
                  >
                    {patientLinks.changeHospital}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <UserForm />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal text-sm text-cyan-600 dark:text-cyan-400"
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    {personalLinks.forgotPassword}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal text-sm text-cyan-600 dark:text-cyan-400"
                    onClick={() => setAddUserOpen(true)}
                  >
                    {personalLinks.register}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {userType === 'patient' && (
        <Alert
          className="mt-3
          border-amber-200 dark:border-amber-900 
          bg-amber-50 dark:bg-amber-950/50 
          text-amber-800 dark:text-amber-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Se recomienda llenar el formulario con asistencia de una persona de confianza que esté
            comprometida con su salud.
          </AlertDescription>
        </Alert>
      )}
    </main>
  )
}

function LoginDialogs() {
  return (
    <>
      <AddPatientDialog />
      <AffiliationChangeDialog />
      <ForgotPasswordDialog />
      <AddUserDialog />
    </>
  )
}
