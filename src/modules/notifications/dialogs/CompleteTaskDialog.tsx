import { Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import type { Notification } from '@/domain/notification.types'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'

interface CompleteTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notification: Notification
  onCompleteTask: (id: string, notes?: string) => Promise<void>
}

export function CompleteTaskDialog({
  open,
  onOpenChange,
  notification,
  onCompleteTask,
}: CompleteTaskDialogProps) {
  const [notes, setNotes] = useState('')
  const lang = useSelector(selectLang)
  const dictionary = langs[lang].dialogs.completeTask
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = (value: boolean) => {
    if (!value) {
      setNotes('')
      setError(null)
    }
    onOpenChange(value)
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onCompleteTask(notification.notificationId, notes)
      setNotes('')
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to complete notification:', err)
      setError(dictionary.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="size-5 text-green-500" />
            {dictionary.title}
          </DialogTitle>
          <DialogDescription>{dictionary.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="rounded-md px-4 py-3 bg-amber-800/50 text-amber-100">
            <p className="text-sm font-medium">
              {notification.title || dictionary.defaultNotificationTitle}
            </p>
            <p className="text-sm mt-1">
              {notification.content || langs[lang].components.notificationListItem.noDetails}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">{dictionary.notesLabel}</Label>
            <Textarea
              id="notes"
              placeholder={dictionary.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-25"
            />
          </div>
          {error && <p className="mt-2 error-message">{error}</p>}
        </div>

        <DialogFooter className="mt-3 flex justify-end">
          <Button disabled={isSubmitting} onClick={handleComplete} className="btn-success-action">
            {isSubmitting ? (
              <Loader2 className="size-4 mr-1 animate-spin" />
            ) : (
              <Check className="size-4 mr-1" />
            )}
            {isSubmitting ? dictionary.saving : dictionary.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
