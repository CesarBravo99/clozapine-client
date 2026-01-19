import { Shield, Save } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { useConfigContext } from '@/modules/config/contexts'
import { langs } from '@/modules/config/lang'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const TIMEOUT_OPTIONS = ['5', '10', '15', '30', '60']

export function SecuritySettings() {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.securitySettings
  const { securitySettings, updateSecuritySettings, persistSecuritySettings } = useConfigContext()

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full">
      <div className="bg-gray-50 dark:bg-gray-800 p-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          {text.title}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">{text.twoFactorLabel}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{text.twoFactorDescription}</p>
          </div>
          <Switch
            checked={securitySettings.twoFactorRequired}
            onCheckedChange={(checked) => updateSecuritySettings({ twoFactorRequired: checked })}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">{text.autoLockLabel}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{text.autoLockDescription}</p>
          </div>
          <Switch
            checked={securitySettings.autoLockEnabled}
            onCheckedChange={(checked) => updateSecuritySettings({ autoLockEnabled: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label>{text.timeoutLabel}</Label>
          <Select
            value={securitySettings.autoLockTimeoutMinutes.toString()}
            onValueChange={(value) =>
              updateSecuritySettings({ autoLockTimeoutMinutes: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="15" />
            </SelectTrigger>
            <SelectContent>
              {TIMEOUT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">{text.loginAlertsLabel}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {text.loginAlertsDescription}
            </p>
          </div>
          <Switch
            checked={securitySettings.loginAlertsEnabled}
            onCheckedChange={(checked) => updateSecuritySettings({ loginAlertsEnabled: checked })}
          />
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 w-full" onClick={persistSecuritySettings}>
          <Save className="mr-2 h-4 w-4" />
          {text.save}
        </Button>
      </div>
    </div>
  )
}
