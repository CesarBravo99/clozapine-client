import { useState, type ReactNode } from 'react'
import { LoginDialogContext } from '@/modules/login/contexts/LoginDialogContext'

interface LoginDialogProviderProps {
  children: ReactNode
}

export function LoginDialogProvider({ children }: LoginDialogProviderProps) {
  const [addPatientOpen, setAddPatientOpen] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [affiliationOpen, setAffiliationOpen] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  return (
    <LoginDialogContext.Provider
      value={{
        addPatientOpen,
        setAddPatientOpen,
        addUserOpen,
        setAddUserOpen,
        affiliationOpen,
        setAffiliationOpen,
        forgotPasswordOpen,
        setForgotPasswordOpen,
      }}
    >
      {children}
    </LoginDialogContext.Provider>
  )
}
