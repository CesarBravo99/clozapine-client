import { createContext, useContext } from 'react'

export interface LoginDialogContextValue {
  addPatientOpen: boolean
  setAddPatientOpen: (open: boolean) => void
  addUserOpen: boolean
  setAddUserOpen: (open: boolean) => void
  affiliationOpen: boolean
  setAffiliationOpen: (open: boolean) => void
  forgotPasswordOpen: boolean
  setForgotPasswordOpen: (open: boolean) => void
}

export const LoginDialogContext = createContext<LoginDialogContextValue | undefined>(undefined)

export function useLoginDialogContext() {
  const ctx = useContext(LoginDialogContext)
  if (!ctx) {
    throw new Error('useLoginDialogContext must be used within LoginDialogProvider')
  }
  return ctx
}
