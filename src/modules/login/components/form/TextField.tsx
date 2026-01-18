import { useStore } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFieldContext } from '../../contexts/login-form.context'
import { ErrorMessages } from './ErrorMessages'

interface TextFieldProps {
  label: string
  placeholder?: string
  id?: string
}

export function TextField({ label, placeholder, id }: TextFieldProps) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={id} className="mb-1 text-sm font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
