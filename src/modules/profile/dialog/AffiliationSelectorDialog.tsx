import { Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Affiliation } from '@/domain/affiliation/affiliation.types'
import { langs } from '@/modules/profile/lang'
import { selectLang } from '@/redux/settings/settings.slice'

interface AffiliationSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAffiliationId: number
  onSelectAffiliation: (affiliationId: number) => void
  affiliations: Affiliation[]
}

export function AffiliationSelectorDialog({
  open,
  onOpenChange,
  selectedAffiliationId,
  onSelectAffiliation,
  affiliations,
}: AffiliationSelectorDialogProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.affiliationSelector

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-124 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900 dark:text-white">{text.title}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {text.description}
          </DialogDescription>
        </DialogHeader>

        <div className="pb-2">
          <RadioGroup
            value={selectedAffiliationId.toString()}
            onValueChange={(value) => onSelectAffiliation(Number(value))}
            className="flex flex-col gap-2"
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
                    <div className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check className="size-3.5" />
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onSelectAffiliation(selectedAffiliationId)}
            className="w-full sm:w-auto btn-color-common"
          >
            {text.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
