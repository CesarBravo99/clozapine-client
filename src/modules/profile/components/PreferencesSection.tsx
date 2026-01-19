import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Moon, Sun } from 'lucide-react'
import type { FontSizeOption, NotificationPreferencesState } from '@/modules/profile/context'
import { useDispatch, useSelector } from 'react-redux'
import { selectLang, selectSettings, toggleTheme } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/profile/lang'

interface PreferencesSectionProps {
  fontSize: FontSizeOption
  setFontSize: (size: FontSizeOption) => void
  notificationPreferences: NotificationPreferencesState
  setNotificationPreference: (channel: string, value: boolean) => void
  onSave: () => void
  isSaving: boolean
}

export function PreferencesSection({
  fontSize,
  setFontSize,
  notificationPreferences,
  setNotificationPreference,
  onSave,
  isSaving,
}: PreferencesSectionProps) {
  const dispatch = useDispatch()
  const lang = useSelector(selectLang)
  const settings = useSelector(selectSettings)
  const theme = settings.theme
  const text = langs[lang].components.preferences

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{text.notificationsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-pref" className="flex-1 cursor-pointer">
              {text.emailNotifications}
            </Label>
            <Switch
              id="email-pref"
              checked={notificationPreferences.email}
              onCheckedChange={(checked) => setNotificationPreference('email', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="app-pref" className="flex-1 cursor-pointer">
              {text.appNotifications}
            </Label>
            <Switch
              id="app-pref"
              checked={notificationPreferences.app}
              onCheckedChange={(checked) => setNotificationPreference('app', checked)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSave} className="bg-blue-500 hover:bg-blue-600" disabled={isSaving}>
            {isSaving ? text.saving : text.save}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{text.appearanceTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="block text-sm font-medium mb-2">{text.themeLabel}</Label>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
                <div className="font-medium">
                  {theme === 'dark' ? text.darkModeLabel : text.lightModeLabel}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto gap-1.5"
                onClick={() => dispatch(toggleTheme())}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? text.changeToLight : text.changeToDark}
              </Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">{text.fontSizeLabel}</Label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border shadow-sm px-4 py-3 space-y-3">
              <RadioGroup
                value={fontSize}
                onValueChange={(value: FontSizeOption) => setFontSize(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="font-small" />
                  <Label
                    htmlFor="font-small"
                    className={`text-sm ${
                      fontSize === 'small' ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {text.fontSizes.small}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="font-medium" />
                  <Label
                    htmlFor="font-medium"
                    className={`text-base ${
                      fontSize === 'medium' ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {text.fontSizes.medium}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="font-large" />
                  <Label
                    htmlFor="font-large"
                    className={`text-lg ${
                      fontSize === 'large' ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    {text.fontSizes.large}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
