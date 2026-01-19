import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/config/lang'
import { useConfigContext } from '@/modules/config/contexts'
import { UserCog, Save } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const EXPIRY_OPTIONS = ['30', '60', '90', '180', 'never']
const LENGTH_OPTIONS = ['6', '8', '10', '12']

export function PasswordPolicies() {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.passwordPolicies
  const { passwordPolicy, updatePasswordPolicy, persistPasswordPolicy } = useConfigContext()

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden w-full">
      <div className="bg-gray-50 dark:bg-gray-800 p-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <UserCog className="h-5 w-5 text-blue-500" />
          {text.title}
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>{text.expiryLabel}</Label>
          <Select
            value={passwordPolicy.passwordExpiryDays.toString()}
            onValueChange={(value) =>
              updatePasswordPolicy({
                passwordExpiryDays: value === 'never' ? 'never' : Number(value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="90" />
            </SelectTrigger>
            <SelectContent>
              {EXPIRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === 'never' ? 'Nunca' : `${option} días`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{text.minLengthLabel}</Label>
          <Select
            value={passwordPolicy.minimumLength.toString()}
            onValueChange={(value) => updatePasswordPolicy({ minimumLength: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="8" />
            </SelectTrigger>
            <SelectContent>
              {LENGTH_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option} caracteres
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-blue-500 hover:bg-blue-600 w-full" onClick={persistPasswordPolicy}>
          <Save className="mr-2 h-4 w-4" />
          {text.save}
        </Button>
      </div>
    </div>
  )
}
