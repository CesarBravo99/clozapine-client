import { useRouteContext } from '@tanstack/react-router'
import { Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { ProfileDisplayData } from '@/api/profile'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUpdateSecurityMutation } from '@/modules/profile/hooks/useUpdateSecurityMutation'

interface SecurityFormProps {
  userRut: number
  profile: ProfileDisplayData
}

export function SecurityForm({ userRut, profile }: SecurityFormProps) {
  const routeContext = useRouteContext({ from: '__root__' })
  const { axiosClient } = routeContext
  const updateSecurityMutation = useUpdateSecurityMutation(axiosClient, userRut)

  // Track which field is being saved
  const [savingField, setSavingField] = useState<string | null>(null)
  const [savedField, setSavedField] = useState<string | null>(null)

  // Current form values (initialized from profile)
  const [securitySettings, setSecuritySettings] = useState({
    onlyOneSessionPerDevice: profile.settings.security.onlyOneSession,
    showProfilePicture: profile.settings.security.showProfilePicture,
  })

  const handleFieldChange = async (fieldName: string, value: boolean) => {
    // Update local state immediately for UI responsiveness
    setSecuritySettings((prev) => ({ ...prev, [fieldName]: value }))

    // Set saving state
    setSavingField(fieldName)
    setSavedField(null)

    try {
      // Save the change
      await updateSecurityMutation.mutateAsync({
        [fieldName]: value,
      })

      // Show success feedback
      setSavingField(null)
      setSavedField(fieldName)

      // Clear success feedback after 2 seconds
      setTimeout(() => setSavedField(null), 2000)
    } catch (error) {
      // Revert local state on error
      setSecuritySettings((prev) => ({
        ...prev,
        [fieldName]:
          fieldName === 'onlyOneSessionPerDevice'
            ? profile.settings.security.onlyOneSession
            : profile.settings.security.showProfilePicture,
      }))
      setSavingField(null)
      console.error('Failed to save security setting:', error)
    }
  }

  const FieldStatus = ({ fieldName }: { fieldName: string }) => {
    if (savingField === fieldName) {
      return <Loader2 className="size-4 animate-spin text-blue-500" />
    }
    if (savedField === fieldName) {
      return <Check className="size-4 text-green-500" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white">
          Configuración de Seguridad
        </h4>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Una sesión por dispositivo
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cerrar otras sesiones al iniciar sesión en un nuevo dispositivo
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FieldStatus fieldName="onlyOneSessionPerDevice" />
            <Switch
              checked={securitySettings.onlyOneSessionPerDevice}
              onCheckedChange={(checked) => handleFieldChange('onlyOneSessionPerDevice', checked)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mostrar foto de perfil
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Permitir que otros usuarios vean tu foto de perfil
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FieldStatus fieldName="showProfilePicture" />
            <Switch
              checked={securitySettings.showProfilePicture}
              onCheckedChange={(checked) => handleFieldChange('showProfilePicture', checked)}
            />
          </div>
        </div>
      </div>

      {updateSecurityMutation.isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            Error al guardar configuración: {updateSecurityMutation.error?.message}
          </p>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          💡 Los cambios se guardan automáticamente
        </p>
      </div>
    </div>
  )
}
