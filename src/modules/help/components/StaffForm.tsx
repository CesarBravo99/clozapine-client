import { Lock } from 'lucide-react'
import type { FormEvent } from 'react'
import { useSelector } from 'react-redux'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useHelpContext } from '@/modules/help/contexts'
import { langs } from '@/modules/help/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export function StaffForm() {
  const lang = useSelector(selectLang)
  const text = langs[lang]
  const {
    staffAuthenticated,
    staffForm,
    updateStaffForm,
    submitStaffForm,
    showStaffOtherHospital,
    isSubmitting,
    hospitals,
    staffIssueTypes,
    simulateStaffLogin,
  } = useHelpContext()

  if (!staffAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <Lock className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {text.components.staffBanner.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          {text.components.staffBanner.description}
        </p>
        <Alert variant="default">
          <AlertDescription>{text.components.staffBanner.requireLogin}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={simulateStaffLogin}>
          {text.components.staffBanner.login}
        </Button>
      </div>
    )
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submitStaffForm()
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label>{text.components.forms.hospital}</Label>
        <Select
          value={staffForm.hospitalId === '' ? undefined : staffForm.hospitalId.toString()}
          onValueChange={(value) => {
            if (value === 'other') {
              updateStaffForm({ hospitalId: 'other' })
            } else {
              updateStaffForm({ hospitalId: Number(value), otherHospital: '' })
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={text.components.forms.hospital} />
          </SelectTrigger>
          <SelectContent>
            {hospitals.map((hospital) => (
              <SelectItem key={hospital.affiliationId} value={hospital.affiliationId.toString()}>
                {hospital.name}
              </SelectItem>
            ))}
            <SelectItem value="other">{text.components.forms.otherHospital}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showStaffOtherHospital && (
        <div className="space-y-2">
          <Label>{text.components.forms.otherHospital}</Label>
          <Input
            value={staffForm.otherHospital}
            onChange={(event) => updateStaffForm({ otherHospital: event.target.value })}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label>{text.components.forms.issueType}</Label>
        <Select
          value={staffForm.issueType || undefined}
          onValueChange={(value) => updateStaffForm({ issueType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={text.components.forms.issueType} />
          </SelectTrigger>
          <SelectContent>
            {staffIssueTypes.map((issue) => (
              <SelectItem key={issue} value={issue}>
                {issue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{text.components.forms.message}</Label>
        <Textarea
          rows={5}
          value={staffForm.message}
          onChange={(event) => updateStaffForm({ message: event.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {text.components.forms.send}
      </Button>
    </form>
  )
}
