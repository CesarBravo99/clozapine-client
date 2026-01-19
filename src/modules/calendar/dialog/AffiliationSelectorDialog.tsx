import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/calendar/lang'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'

interface AffiliationSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  affiliations: Affiliation[]
  selectedAffiliationId: number
  onSelect: (affiliationId: number) => void
}

export function AffiliationSelectorDialog({
  open,
  onOpenChange,
  affiliations,
  selectedAffiliationId,
  onSelect,
}: AffiliationSelectorDialogProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.affiliationSelector

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedAffiliationId.toString()}
            onValueChange={(value) => onSelect(Number(value))}
            className="space-y-4"
          >
            {affiliations.map((affiliation) => (
              <div
                key={affiliation.affiliationId}
                className={`flex items-center space-x-4 rounded-lg border p-4 transition-all ${
                  selectedAffiliationId === affiliation.affiliationId
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                }`}
              >
                <RadioGroupItem
                  value={affiliation.affiliationId.toString()}
                  id={affiliation.affiliationId.toString()}
                  className="sr-only"
                />
                <Label
                  htmlFor={affiliation.affiliationId.toString()}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {affiliation.affiliationName}
                  </div>
                  {selectedAffiliationId === affiliation.affiliationId && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => onSelect(selectedAffiliationId)}
          >
            {text.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
