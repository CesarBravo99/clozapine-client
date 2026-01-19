import { useStore } from '@tanstack/react-form'
import { useFieldContext } from '../../contexts/profile-form.context'
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ErrorMessages } from './ErrorMessages'

interface SelectProps {
  label: string
  placeholder?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, placeholder, options }: SelectProps) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
      <SelectComponent
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectComponent>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
