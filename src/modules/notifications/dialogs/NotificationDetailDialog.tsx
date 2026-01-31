import { Calendar, Check, Clock, FileText, User, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getNotificationColor, getNotificationTypeText } from '@/api/notifications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Notification } from '@/domain/notification.types'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'
import { LanguageState } from '@/redux/settings/settings.types'
import type { NotificationPatientSummary } from '../context/NotificationContext'
import { CompleteTaskDialog } from './CompleteTaskDialog'

interface NotificationDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notification: Notification | null
  patient?: NotificationPatientSummary | null
  onCompleteNotification: (id: string, notes?: string) => Promise<void>
  onViewPatient?: (patientRut: number, patientName?: string | null) => void
  onScheduleAppointment?: (patientRut?: number) => void
}

const ensureMetadata = (notification: Notification | null) => {
  if (!notification?.metadata) {
    return {
      taskCompleted: false,
      completedBy: null,
      completedAt: null,
    }
  }

  return {
    taskCompleted: notification.metadata.taskCompleted ?? false,
    completedBy: notification.metadata.completedBy ?? null,
    completedAt: notification.metadata.completedAt ?? null,
  }
}

const formatDateTime = (
  value: string | null | undefined,
  lang: LanguageState,
  fallback: string
) => {
  if (!value) {
    return fallback
  }

  const locale = lang === LanguageState.ES ? 'es-ES' : 'en-US'
  try {
    const date = new Date(value)
    const datePart = date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timePart = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${datePart} • ${timePart}`
  } catch (error: unknown) {
    console.error('Error formatting date:', error)
    return fallback
  }
}

export function NotificationDetailDialog({
  open,
  onOpenChange,
  notification,
  patient,
  onCompleteNotification,
  onViewPatient,
  onScheduleAppointment,
}: NotificationDetailDialogProps) {
  const lang = useSelector(selectLang)
  const dictionary = langs[lang].dialogs.notificationDetail
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  const metadata = useMemo(() => ensureMetadata(notification), [notification])

  const notificationType = useMemo(() => {
    if (!notification) return null
    return {
      label: getNotificationTypeText(notification.type, lang, true),
      color: getNotificationColor(notification.type),
    }
  }, [notification, lang])

  if (!notification) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-155">
        <DialogHeader>
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-xl font-semibold">
              {notification.title || notificationType?.label || dictionary.defaultTitle}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-gray-400" />
              {formatDateTime(notification.date, lang, dictionary.dateFallback)}
            </DialogDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {notificationType && (
              <Badge variant="outline" className="gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${notificationType.color}`} />
                {notificationType.label}
              </Badge>
            )}
            {metadata.taskCompleted && (
              <Badge variant="outline" className="border-green-200 text-green-600">
                <Check className="mr-1 h-3.5 w-3.5" />
                dictionary.completedBadge
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {dictionary.contentTitle}
            </h3>
            <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-6 dark:border-gray-800 dark:bg-gray-900">
              {notification.content || dictionary.contentFallback}
            </p>
          </section>

          {patient && (
            <>
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-gray-500" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {dictionary.patientSectionTitle}
                  </h3>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      {patient.fullName ?? dictionary.patientFallbackName}
                    </p>
                    {patient.rutFormatted && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {dictionary.rutLabel.replace('{rut}', patient.rutFormatted)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        {dictionary.lastControl}
                      </span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {patient.lastControl ?? dictionary.lastControlFallback}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{dictionary.status}</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {patient.state ?? dictionary.statusFallback}
                      </p>
                    </div>
                  </div>

                  {patient.raw?.rawData?.userRut && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dictionary.assignationLabel.replace(
                        '{rut}',
                        String(patient.raw.rawData.userRut)
                      )}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 justify-end">
                    {onViewPatient && patient.patientRut > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewPatient(patient.patientRut, patient.fullName)}
                      >
                        <FileText className="mr-2 size-4" />
                        {dictionary.viewRecord}
                      </Button>
                    )}
                    {patient.raw?.rawData?.userRut && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dictionary.assignationLabel.replace(
                          '{rut}',
                          String(patient.raw.rawData.userRut)
                        )}
                      </p>
                    )}
                    {onScheduleAppointment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onScheduleAppointment(patient.patientRut || undefined)}
                      >
                        <Calendar className="mr-2 size-4" />
                        {dictionary.schedule}
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {metadata.taskCompleted && (
            <>
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {dictionary.completionInfoTitle}
                </h3>
                <div className="flex flex-col gap-2 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="size-4" />
                    <span>{dictionary.completionStatus}</span>
                  </div>
                  {metadata.completedBy && (
                    <p>
                      {dictionary.completionResponsible.replace(
                        '{name}',
                        String(metadata.completedBy)
                      )}
                    </p>
                  )}
                  <p>
                    {dictionary.completionDate.replace(
                      '{date}',
                      formatDateTime(metadata.completedAt, lang, dictionary.dateFallback)
                    )}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 size-4" />
            {dictionary.close}
          </Button>
          {!metadata.taskCompleted && (
            <Button
              onClick={() => setShowCompleteDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 size-4" />
              {dictionary.markAsCompleted}
            </Button>
          )}
        </DialogFooter>

        <CompleteTaskDialog
          open={showCompleteDialog}
          onOpenChange={setShowCompleteDialog}
          notification={notification}
          onCompleteTask={onCompleteNotification}
        />
      </DialogContent>
    </Dialog>
  )
}
