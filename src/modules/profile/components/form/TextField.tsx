import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../../contexts/profile-form.context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessages } from './ErrorMessages'

interface TextFieldProps {
  label: string
  placeholder?: string
  type?: string
}

export function TextField({ label, placeholder, type = 'text' }: TextFieldProps) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <Input
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
