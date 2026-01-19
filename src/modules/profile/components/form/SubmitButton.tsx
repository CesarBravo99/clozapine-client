import { useFormContext } from '../../contexts/profile-form.context'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  label: string
  disabled?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
}

export function SubmitButton({
  label,
  disabled = false,
  variant = 'default',
  className = '',
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <Button
      type="submit"
      disabled={disabled || !form.state.canSubmit}
      variant={variant}
      className={`w-full ${className}`}
    >
      {label}
    </Button>
  )
}
