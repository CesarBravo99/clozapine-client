import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePrescriptionsContext } from '../contexts/PrescriptionsContext'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '../lang'
import { LanguageState } from '@/redux/settings/settings.types'
import { format } from 'date-fns'
import type { Locale } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

export function PrescriptionDetailDialog() {
  const {
    selectedPrescription,
    isDetailDialogOpen,
    isDialogActionLoading,
    activeDialogAction,
    dialogActionError,
    closePrescriptionDetail,
    cancelPrescription,
    renewPrescription,
  } = usePrescriptionsContext()
  const lang = useSelector(selectLang)
  const dictionary = langs[lang].dialogs.detail
  const locale: Locale = lang === LanguageState.ES ? es : enUS

  if (!selectedPrescription) {
    return null
  }

  const { rawData } = selectedPrescription
  const formattedDate = rawData
    ? safeFormatDate(rawData.prescriptionDate, locale)
    : selectedPrescription.prescriptionDate
  const dosage =
    rawData?.drugDosageQuantity && rawData?.drugDosageUnit
      ? `${rawData.drugDosageQuantity} ${rawData.drugDosageUnit}`
      : dictionary.labels.notAvailable
  const schedule =
    rawData?.drugTimeQuantity && rawData?.drugTimeUnit
      ? `${rawData.drugTimeQuantity} ${rawData.drugTimeUnit}`
      : dictionary.labels.notAvailable
  const duration =
    rawData?.drugDurationQuantity && rawData?.drugDurationUnit
      ? `${rawData.drugDurationQuantity} ${rawData.drugDurationUnit}`
      : dictionary.labels.notAvailable
  const route = rawData?.drugAdministrationRoute || dictionary.labels.notAvailable
  const notes = rawData?.notes?.trim() || dictionary.labels.noNotes

  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={(open) => !open && closePrescriptionDetail()}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>{dictionary.title}</DialogTitle>
          <DialogDescription>{dictionary.subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {dictionary.sections.patient}
            </h3>
            <div className="flex flex-col gap-1 rounded-md border border-gray-100 px-3 py-2 dark:border-gray-800">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {selectedPrescription.patientName}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dictionary.labels.patientRut}: {selectedPrescription.patientRut}
              </span>
            </div>
          </section>

          <Separator />

          <section className="grid gap-4 text-sm md:grid-cols-2">
            <InfoRow label={dictionary.labels.medication} value={selectedPrescription.medication} />
            <InfoRow label={dictionary.labels.status} value={selectedPrescription.status} />
            <InfoRow label={dictionary.labels.dosage} value={dosage} />
            <InfoRow label={dictionary.labels.schedule} value={schedule} />
            <InfoRow label={dictionary.labels.duration} value={duration} />
            <InfoRow label={dictionary.labels.route} value={route} />
            <InfoRow label={dictionary.labels.date} value={formattedDate} />
            {rawData?.clinicalRecordId ? (
              <InfoRow
                label={dictionary.labels.clinicalRecord}
                value={`#${rawData.clinicalRecordId}`}
              />
            ) : null}
          </section>

          <Separator />

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {dictionary.labels.notes}
            </h3>
            <p className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
              {notes}
            </p>
          </section>

          {dialogActionError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {dictionary.errorPrefix}: {dialogActionError}
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            disabled={isDialogActionLoading && activeDialogAction !== 'cancel'}
            onClick={cancelPrescription}
          >
            {isDialogActionLoading && activeDialogAction === 'cancel'
              ? dictionary.buttons.canceling
              : dictionary.buttons.cancel}
          </Button>
          <Button
            disabled={isDialogActionLoading && activeDialogAction !== 'renew'}
            onClick={renewPrescription}
          >
            {isDialogActionLoading && activeDialogAction === 'renew'
              ? dictionary.buttons.renewing
              : dictionary.buttons.renew}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-gray-100 px-3 py-2 dark:border-gray-800">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}

function safeFormatDate(value: string, locale: Locale): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return format(parsed, 'PP', { locale })
}
