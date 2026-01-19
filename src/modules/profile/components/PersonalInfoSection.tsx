import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import type { ProfileDisplayData } from '@/api/profile'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/profile/lang'

interface PersonalInfoSectionProps {
  profile: ProfileDisplayData | null
  currentAffiliationName?: string | null
  onChangeAffiliation: () => void
}

export function PersonalInfoSection({
  profile,
  currentAffiliationName,
  onChangeAffiliation,
}: PersonalInfoSectionProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.personalInfo

  if (!profile) {
    return null
  }

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          {text.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">{text.name}</Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.personalInfo.name}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">{text.rut}</Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.personalInfo.rut}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">{text.sex}</Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.personalInfo.sex}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">{text.birthDate}</Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.personalInfo.birthDate}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">{text.age}</Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {text.ageWithValue.replace('{value}', profile.personalInfo.age.toString())}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-500 dark:text-gray-400">
              {text.accountCreated}
            </Label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {profile.personalInfo.createdAt}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm text-gray-500 dark:text-gray-400">
              {text.currentHospital}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {currentAffiliationName || text.noAffiliation}
              </p>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                onClick={onChangeAffiliation}
              >
                {text.changeAffiliation}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
