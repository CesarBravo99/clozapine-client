import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ProfileDisplayData } from '@/api/profile'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { langs } from '@/modules/profile/lang'
import { setSelectedAffiliationId } from '@/redux/session/session.slice'
import { selectLang } from '@/redux/settings/settings.slice'

export type ProfileTab = 'personal' | 'security' | 'preferences'
export type FontSizeOption = 'small' | 'medium' | 'large'

export interface NotificationPreferencesState {
  email: boolean
  app: boolean
}

export interface ContactInfoState {
  email: string
  phone: string
}

export interface ProfileProviderProps {
  children: ReactNode
  profile: ProfileDisplayData | null
  userRut: number | null
  affiliations: Affiliation[]
  selectedAffiliationId: number
}

interface ProfileContextValue {
  profile: ProfileDisplayData | null
  userRut: number | null
  affiliations: Affiliation[]
  selectedAffiliationId: number
  setSelectedAffiliation: (affiliationId: number) => void
  isAffiliationDialogOpen: boolean
  setAffiliationDialogOpen: (open: boolean) => void

  activeTab: ProfileTab
  setActiveTab: (tab: ProfileTab) => void
  sidebarCollapsed: boolean
  isExtraSmallScreen: boolean

  contactInfo: ContactInfoState
  updateContactInfo: (fields: Partial<ContactInfoState>) => void
  handleSaveContactInfo: () => void
  isSavingContactInfo: boolean

  fontSize: FontSizeOption
  setFontSize: (size: FontSizeOption) => void
  notificationPreferences: NotificationPreferencesState
  setNotificationPreference: (channel: string, value: boolean) => void
  handleSaveNotificationPreferences: () => void
  isSavingPreferences: boolean

  successMessage: string | null
  hideSuccessMessage: () => void
  showSuccessMessage: (message: string) => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

const FONT_SIZE_STORAGE_KEY = 'text-size-preference'

const normalizeFontSize = (value?: string | null): FontSizeOption => {
  const normalized = value?.toLowerCase()
  if (normalized?.includes('small') || normalized?.includes('peque')) {
    return 'small'
  }
  if (normalized?.includes('large') || normalized?.includes('grande')) {
    return 'large'
  }
  return 'medium'
}

const deriveContactInfo = (
  profile: ProfileDisplayData | null,
  selectedAffiliationId: number
): ContactInfoState => {
  const affiliation =
    profile?.affiliations.find((item) => item.id === selectedAffiliationId) ??
    profile?.affiliations[0]

  return {
    email: affiliation?.email ?? '',
    phone: affiliation?.phone ?? '',
  }
}

const ensureAffiliationId = (affiliations: Affiliation[], value: number) => {
  if (value > 0) {
    return value
  }

  if (affiliations.length > 0) {
    return affiliations[0].affiliationId
  }

  return -1
}

export function ProfileProvider({
  children,
  profile,
  userRut,
  affiliations,
  selectedAffiliationId: initialSelectedAffiliationId,
}: ProfileProviderProps) {
  const dispatch = useDispatch()
  const lang = useSelector(selectLang)
  const translations = langs[lang] ?? langs.es

  const [selectedAffiliationId, setSelectedAffiliationIdState] = useState(() =>
    ensureAffiliationId(affiliations, initialSelectedAffiliationId)
  )

  useEffect(() => {
    setSelectedAffiliationIdState((prev) => {
      if (prev > 0) {
        return prev
      }
      return ensureAffiliationId(affiliations, initialSelectedAffiliationId)
    })
  }, [affiliations, initialSelectedAffiliationId])

  const [activeTab, setActiveTab] = useState<ProfileTab>('personal')
  const [isAffiliationDialogOpen, setAffiliationDialogOpen] = useState(false)

  const isExtraSmallScreen = useMediaQuery('(max-width: 640px)')
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setSidebarCollapsed(isExtraSmallScreen || isSmallScreen)
  }, [isExtraSmallScreen, isSmallScreen])

  const [contactInfo, setContactInfo] = useState<ContactInfoState>(() =>
    deriveContactInfo(profile, selectedAffiliationId)
  )
  const [isSavingContactInfo, setSavingContactInfo] = useState(false)

  useEffect(() => {
    setContactInfo(deriveContactInfo(profile, selectedAffiliationId))
  }, [profile, selectedAffiliationId])

  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferencesState>(() => ({
      email: profile?.settings.notifications.email ?? true,
      app: profile?.settings.notifications.whatsapp ?? true,
    }))

  useEffect(() => {
    setNotificationPreferences({
      email: profile?.settings.notifications.email ?? true,
      app: profile?.settings.notifications.whatsapp ?? true,
    })
  }, [profile])

  const getStoredFontSize = () => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(FONT_SIZE_STORAGE_KEY)
  }

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    const stored = getStoredFontSize()
    if (stored) {
      return stored as FontSizeOption
    }
    return normalizeFontSize(profile?.settings.fontSize)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: Needed only on mount
  useEffect(() => {
    const stored = getStoredFontSize()
    if (stored && stored !== fontSize) {
      setFontSizeState(stored as FontSizeOption)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove(
        'text-size-small',
        'text-size-medium',
        'text-size-large'
      )
      document.documentElement.classList.add(`text-size-${fontSize}`)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize)
    }
  }, [fontSize])

  const [isSavingPreferences, setSavingPreferences] = useState(false)

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

  const handleSaveContactInfo = useCallback(() => {
    setSavingContactInfo(true)
    setTimeout(() => {
      setSavingContactInfo(false)
      showSuccessMessage(translations.messages.contactSaved)
    }, 600)
  }, [showSuccessMessage, translations.messages.contactSaved])

  const handleSaveNotificationPreferences = useCallback(() => {
    setSavingPreferences(true)
    setTimeout(() => {
      setSavingPreferences(false)
      showSuccessMessage(translations.messages.preferencesSaved)
    }, 600)
  }, [showSuccessMessage, translations.messages.preferencesSaved])

  const updateContactInfo = useCallback((fields: Partial<ContactInfoState>) => {
    setContactInfo((prev) => ({ ...prev, ...fields }))
  }, [])

  const setNotificationPreference = useCallback((channel: string, value: boolean) => {
    setNotificationPreferences((prev) => {
      if (!(channel in prev)) {
        return prev
      }
      const key = channel as keyof NotificationPreferencesState
      return { ...prev, [key]: value }
    })
  }, [])

  const setFontSize = useCallback((size: FontSizeOption) => {
    setFontSizeState(size)
  }, [])

  const setSelectedAffiliation = useCallback(
    (id: number) => {
      setSelectedAffiliationIdState(id)
      dispatch(setSelectedAffiliationId(id))
      showSuccessMessage(translations.messages.affiliationUpdated)
    },
    [dispatch, showSuccessMessage, translations.messages.affiliationUpdated]
  )

  const value: ProfileContextValue = useMemo(
    () => ({
      profile,
      userRut,
      affiliations,
      selectedAffiliationId,
      setSelectedAffiliation,
      isAffiliationDialogOpen,
      setAffiliationDialogOpen,
      activeTab,
      setActiveTab,
      sidebarCollapsed,
      isExtraSmallScreen,
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
      successMessage,
      hideSuccessMessage,
      showSuccessMessage,
    }),
    [
      activeTab,
      affiliations,
      contactInfo,
      fontSize,
      handleSaveContactInfo,
      handleSaveNotificationPreferences,
      isAffiliationDialogOpen,
      isExtraSmallScreen,
      isSavingContactInfo,
      isSavingPreferences,
      notificationPreferences,
      profile,
      selectedAffiliationId,
      setSelectedAffiliation,
      sidebarCollapsed,
      successMessage,
      updateContactInfo,
      userRut,
      hideSuccessMessage,
      setFontSize,
      setNotificationPreference,
    ]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfileContext() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider')
  }
  return context
}
