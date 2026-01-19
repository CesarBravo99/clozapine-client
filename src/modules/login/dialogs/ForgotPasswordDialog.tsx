import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/login/lang'
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext'

export function ForgotPasswordDialog() {
  const lang = useSelector(selectLang)
  const text = langs[lang].dialogs.forgotPassword
  const { forgotPasswordOpen, setForgotPasswordOpen } = useLoginDialogContext()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-rut">{text.fields.rut}</Label>
            <Input id="reset-rut" placeholder={text.placeholders.rut} required />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {text.buttons.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {text.buttons.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
