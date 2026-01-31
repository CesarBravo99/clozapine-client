import { useRouteContext } from '@tanstack/react-router'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  addPersonnel,
  type ConfigAffiliationSettings,
  type ConfigOverview,
  type ConfigPasswordPolicy,
  type ConfigPersonnel,
  type ConfigSecuritySettings,
  deletePersonnel as deletePersonnelApi,
  resetPersonnelPassword,
  saveAffiliationSettings as saveAffiliationSettingsApi,
  savePasswordPolicy as savePasswordPolicyApi,
  saveSecuritySettings as saveSecuritySettingsApi,
  updatePersonnel,
} from '@/api/config'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { useMediaQuery } from '@/hooks/use-media-query'
import { langs } from '@/modules/config/lang'
import { selectLang } from '@/redux/settings/settings.slice'
import {
  ConfigContext,
  type ConfigContextValue,
  type ConfigTab,
  type PersonnelFormData,
} from '../contexts/ConfigContext'

interface ConfigProviderProps {
  children: ReactNode
  configData: ConfigOverview | null
  userRut: number | null
  affiliations: Affiliation[]
  selectedAffiliationId: number
}

const DEFAULT_SECURITY_SETTINGS: ConfigSecuritySettings = {
  twoFactorRequired: false,
  autoLockEnabled: true,
  autoLockTimeoutMinutes: 15,
  loginAlertsEnabled: false,
}

const DEFAULT_PASSWORD_POLICY: ConfigPasswordPolicy = {
  passwordExpiryDays: 90,
  minimumLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialCharacters: false,
}

const DEFAULT_AFFILIATION_SETTINGS: ConfigAffiliationSettings = {
  hospitalName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  allowWeekendAppointments: false,
}

export function ConfigProvider({
  children,
  configData,
  userRut,
  selectedAffiliationId,
}: ConfigProviderProps) {
  const routeContext = useRouteContext({ from: '__root__' })
  const { axiosClient } = routeContext
  const lang = useSelector(selectLang)
  const text = langs[lang] ?? langs.es

  const [activeTab, setActiveTab] = useState<ConfigTab>('security')
  const isExtraSmallScreen = useMediaQuery('(max-width: 640px)')
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setSidebarCollapsed(isExtraSmallScreen || isSmallScreen)
  }, [isExtraSmallScreen, isSmallScreen])

  const [searchTerm, setSearchTerm] = useState('')
  const [personnel, setPersonnel] = useState<ConfigPersonnel[]>(configData?.personnel ?? [])
  useEffect(() => {
    setPersonnel(configData?.personnel ?? [])
  }, [configData])

  const filteredPersonnel = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return personnel
    }
    return personnel.filter((person) => {
      const haystack = `${person.name} ${person.role} ${person.rut} ${person.email}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [personnel, searchTerm])

  const [selectedPersonnel, setSelectedPersonnel] = useState<ConfigPersonnel | null>(null)
  const [isAddPersonnelDialogOpen, setAddPersonnelDialogOpen] = useState(false)
  const [isEditPersonnelDialogOpen, setEditPersonnelDialogOpen] = useState(false)
  const [isDeletePersonnelDialogOpen, setDeletePersonnelDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)

  const [securitySettings, setSecuritySettings] = useState<ConfigSecuritySettings>(
    configData?.securitySettings ?? DEFAULT_SECURITY_SETTINGS
  )
  useEffect(() => {
    setSecuritySettings(configData?.securitySettings ?? DEFAULT_SECURITY_SETTINGS)
  }, [configData])

  const [passwordPolicy, setPasswordPolicy] = useState<ConfigPasswordPolicy>(
    configData?.passwordPolicy ?? DEFAULT_PASSWORD_POLICY
  )
  useEffect(() => {
    setPasswordPolicy(configData?.passwordPolicy ?? DEFAULT_PASSWORD_POLICY)
  }, [configData])

  const [affiliationSettings, setAffiliationSettings] = useState<ConfigAffiliationSettings>(
    configData?.affiliationSettings ?? DEFAULT_AFFILIATION_SETTINGS
  )
  useEffect(() => {
    setAffiliationSettings(configData?.affiliationSettings ?? DEFAULT_AFFILIATION_SETTINGS)
  }, [configData])

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const hideSuccessMessage = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
    setSuccessMessage(null)
  }, [])

  const showSuccessMessage = useCallback((message: string) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }
    setSuccessMessage(message)
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage(null)
      successTimeoutRef.current = null
    }, 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  const handleAddPersonnel = useCallback(
    async (payload: PersonnelFormData) => {
      const { id, ...rest } = payload
      const optimistic: ConfigPersonnel = {
        id: Date.now(),
        name: rest.name,
        role: rest.role,
        rut: rest.rut,
        email: rest.email,
        phone: rest.phone,
        status: rest.status ?? 'active',
      }
      setPersonnel((prev) => [...prev, optimistic])
      setAddPersonnelDialogOpen(false)
      showSuccessMessage(text.messages.personnelAdded)

      try {
        const created = await addPersonnel(selectedAffiliationId, rest, axiosClient)
        setPersonnel((prev) =>
          prev.map((person) => (person.id === optimistic.id ? created : person))
        )
      } catch (error) {
        console.error('Failed to add personnel', error)
      }
    },
    [axiosClient, selectedAffiliationId, showSuccessMessage, text.messages.personnelAdded]
  )

  const handleEditPersonnel = useCallback(
    async (payload: PersonnelFormData) => {
      if (!payload.id) return
      const updated: ConfigPersonnel = {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        rut: payload.rut,
        email: payload.email,
        phone: payload.phone,
        status: payload.status ?? 'active',
      }
      setPersonnel((prev) => prev.map((person) => (person.id === updated.id ? updated : person)))
      setEditPersonnelDialogOpen(false)
      setSelectedPersonnel(null)
      showSuccessMessage(text.messages.personnelUpdated)

      try {
        await updatePersonnel(selectedAffiliationId, updated, axiosClient)
      } catch (error) {
        console.error('Failed to update personnel', error)
      }
    },
    [axiosClient, selectedAffiliationId, showSuccessMessage, text.messages.personnelUpdated]
  )

  const handleDeletePersonnel = useCallback(async () => {
    if (!selectedPersonnel) return
    const personnelId = selectedPersonnel.id
    setPersonnel((prev) => prev.filter((person) => person.id !== personnelId))
    setDeletePersonnelDialogOpen(false)
    setSelectedPersonnel(null)
    showSuccessMessage(text.messages.personnelDeleted)

    try {
      await deletePersonnelApi(selectedAffiliationId, personnelId, axiosClient)
    } catch (error) {
      console.error('Failed to delete personnel', error)
    }
  }, [
    axiosClient,
    selectedAffiliationId,
    selectedPersonnel,
    showSuccessMessage,
    text.messages.personnelDeleted,
  ])

  const handleResetPassword = useCallback(async () => {
    if (!selectedPersonnel) return
    setResetPasswordDialogOpen(false)
    showSuccessMessage(text.messages.passwordReset)

    try {
      await resetPersonnelPassword(selectedAffiliationId, selectedPersonnel.id, axiosClient)
    } catch (error) {
      console.error('Failed to reset password', error)
    }
  }, [
    axiosClient,
    selectedAffiliationId,
    selectedPersonnel,
    showSuccessMessage,
    text.messages.passwordReset,
  ])

  const updateSecuritySettings = useCallback((partial: Partial<ConfigSecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const persistSecuritySettings = useCallback(async () => {
    showSuccessMessage(text.messages.securitySaved)
    try {
      await saveSecuritySettingsApi(selectedAffiliationId, securitySettings, axiosClient)
    } catch (error) {
      console.error('Failed to persist security settings', error)
    }
  }, [
    axiosClient,
    securitySettings,
    selectedAffiliationId,
    showSuccessMessage,
    text.messages.securitySaved,
  ])

  const updatePasswordPolicy = useCallback((partial: Partial<ConfigPasswordPolicy>) => {
    setPasswordPolicy((prev) => ({ ...prev, ...partial }))
  }, [])

  const persistPasswordPolicy = useCallback(async () => {
    showSuccessMessage(text.messages.passwordPolicySaved)
    try {
      await savePasswordPolicyApi(selectedAffiliationId, passwordPolicy, axiosClient)
    } catch (error) {
      console.error('Failed to persist password policy', error)
    }
  }, [
    axiosClient,
    passwordPolicy,
    selectedAffiliationId,
    showSuccessMessage,
    text.messages.passwordPolicySaved,
  ])

  const updateAffiliationSettings = useCallback((partial: Partial<ConfigAffiliationSettings>) => {
    setAffiliationSettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const persistAffiliationSettings = useCallback(async () => {
    showSuccessMessage(text.messages.affiliationSaved)
    try {
      await saveAffiliationSettingsApi(selectedAffiliationId, affiliationSettings, axiosClient)
    } catch (error) {
      console.error('Failed to persist affiliation settings', error)
    }
  }, [
    affiliationSettings,
    axiosClient,
    selectedAffiliationId,
    showSuccessMessage,
    text.messages.affiliationSaved,
  ])

  const value: ConfigContextValue = useMemo(
    () => ({
      userRut,
      activeTab,
      setActiveTab,
      sidebarCollapsed,
      isExtraSmallScreen,
      searchTerm,
      setSearchTerm,
      personnel,
      filteredPersonnel,
      selectedPersonnel,
      setSelectedPersonnel,
      isAddPersonnelDialogOpen,
      setAddPersonnelDialogOpen,
      isEditPersonnelDialogOpen,
      setEditPersonnelDialogOpen,
      isDeletePersonnelDialogOpen,
      setDeletePersonnelDialogOpen,
      isResetPasswordDialogOpen,
      setResetPasswordDialogOpen,
      handleAddPersonnel,
      handleEditPersonnel,
      handleDeletePersonnel,
      handleResetPassword,
      securitySettings,
      updateSecuritySettings,
      persistSecuritySettings,
      passwordPolicy,
      updatePasswordPolicy,
      persistPasswordPolicy,
      affiliationSettings,
      updateAffiliationSettings,
      persistAffiliationSettings,
      successMessage,
      showSuccessMessage,
      hideSuccessMessage,
    }),
    [
      activeTab,
      affiliationSettings,
      filteredPersonnel,
      handleAddPersonnel,
      handleDeletePersonnel,
      handleEditPersonnel,
      handleResetPassword,
      hideSuccessMessage,
      isAddPersonnelDialogOpen,
      isDeletePersonnelDialogOpen,
      isEditPersonnelDialogOpen,
      isExtraSmallScreen,
      isResetPasswordDialogOpen,
      passwordPolicy,
      persistAffiliationSettings,
      persistPasswordPolicy,
      persistSecuritySettings,
      personnel,
      searchTerm,
      securitySettings,
      selectedPersonnel,
      showSuccessMessage,
      sidebarCollapsed,
      successMessage,
      updateAffiliationSettings,
      updatePasswordPolicy,
      updateSecuritySettings,
      userRut,
    ]
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
