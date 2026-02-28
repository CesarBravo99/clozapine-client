import { Calendar, Check, FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Notification } from '@/domain/notification.types'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'
import { useNotificationContext } from '../context'
import { CompleteTaskDialog } from '../dialogs/CompleteTaskDialog'

interface NotificationListItemProps {
  notification: Notification
  getNotificationColor: (type: number) => string
  getNotificationTypeText: (type: number, isPassive?: boolean) => string
  handleViewNotificationDetails: (notification: Notification) => void
  completeNotification: (id: string, notes?: string) => Promise<void>
}

const FALLBACK_COMPLETED_LABEL = 'Completado'

export function NotificationListItem({
  notification,
  getNotificationColor,
  getNotificationTypeText,
  handleViewNotificationDetails,
  completeNotification,
}: NotificationListItemProps) {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const lang = useSelector(selectLang)
  const { handleViewPatientDetails, openAddEventDialog, resolvePatientSummary } =
    useNotificationContext()

  const metadata = notification.metadata ?? null
  const taskCompleted = metadata?.taskCompleted ?? false
  const completedBy = metadata?.completedBy ?? null
  const completedAt = metadata?.completedAt ?? null

  const completedLabel = useMemo(() => {
    if (!taskCompleted) {
      return ''
    }

    const template = langs[lang].components.notificationListItem.completedBy

    if (completedBy) {
      const dateString = completedAt
        ? new Date(completedAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')
        : 'N/A'

      return template.replace('{name}', String(completedBy)).replace('{date}', dateString)
    }

    return langs[lang].components.notificationListItem.completed ?? FALLBACK_COMPLETED_LABEL
  }, [completedAt, completedBy, lang, taskCompleted])

  const accentColor = getNotificationColor(notification.type)
  const patientSummary = resolvePatientSummary(notification)
  const patientName =
    patientSummary?.fullName ?? langs[lang].components.notificationListItem.header.patientFallback
  const patientRut =
    patientSummary?.patientRut && patientSummary.patientRut > 0 ? patientSummary.patientRut : null
  const patientRutFormatted =
    patientSummary?.rutFormatted ?? (patientRut ? String(patientRut) : null)

  const content =
    notification.content?.trim() || langs[lang].components.notificationListItem.noDetails

  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: Needed */}
      <div
        key={notification.notificationId}
        onClick={() => handleViewNotificationDetails(notification)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleViewNotificationDetails(notification)
          }
        }}
        className={`w-full text-left p-6 transition-colors ${taskCompleted ? 'bg-gray-50/60 dark:bg-gray-900/30' : 'hover:bg-gray-50/80 dark:hover:bg-gray-900/40'}`}
      >
        <div className="space-y-4">
          <header className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-50">
                  {patientName}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {patientRutFormatted
                    ? `RUT: ${patientRutFormatted}`
                    : langs[lang].components.notificationListItem.header.rutFallback}
                </span>
              </div>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  if (patientRut) {
                    handleViewPatientDetails(patientRut, patientName || undefined)
                  }
                }}
                disabled={!patientRut}
                className="flex items-center gap-2 border-blue-200 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText className="h-4 w-4" />
                {langs[lang].components.notificationListItem.header.viewRecord}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  openAddEventDialog(patientRut || undefined)
                }}
                className="flex items-center gap-2 border-blue-200 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-900/30"
              >
                <Calendar className="h-4 w-4" />
                {langs[lang].components.notificationListItem.header.schedule}
              </Button>

              {taskCompleted && (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-xs font-medium text-green-700 dark:border-green-900 dark:bg-green-900/30 dark:text-green-300"
                >
                  {langs[lang].components.notificationListItem.completed}
                </Badge>
              )}

              {!taskCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    setShowCompleteDialog(true)
                  }}
                  className="h-8 border-blue-200 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-900/30"
                >
                  {langs[lang].components.notificationListItem.complete}
                </Button>
              )}
            </div>
          </header>

          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${accentColor}`}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {getNotificationTypeText(notification.type, true)}
              </span>
            </div>

            <article
              className={`rounded-lg border border-transparent p-3 text-sm leading-relaxed ${
                taskCompleted
                  ? 'text-gray-500 line-through decoration-gray-300 dark:text-gray-400 dark:decoration-gray-600'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              <p>{content}</p>
            </article>
          </section>

          {taskCompleted && completedLabel && (
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="italic">{completedLabel}</span>
            </div>
          )}
        </div>
      </div>

      <CompleteTaskDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        notification={notification}
        onCompleteTask={completeNotification}
      />
    </>
  )
}
