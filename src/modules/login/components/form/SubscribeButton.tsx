import { Button } from '@/components/ui/button'

interface SubscribeButtonProps {
  label: string
  disabled?: boolean
  type: 'user' | 'patient'
}

export const SubscribeButton = ({ label, disabled, type }: SubscribeButtonProps) => {
  if (type === 'user') {
    return (
      <Button
        type="submit"
        className="w-full py-3 mt-3 text-white rounded-md font-medium transition-all
					bg-linear-to-r from-cyan-500 to-cyan-600 
					hover:from-cyan-600 hover:to-cyan-700"
        disabled={disabled}
      >
        {label}
      </Button>
    )
  }

  return (
    <Button
      type="submit"
      className="w-full py-3 mt-3 rounded-md font-medium text-white transition-all
				bg-linear-to-r from-blue-500 to-blue-600 
				hover:from-blue-600 hover:to-blue-700"
      disabled={disabled}
    >
      {label}
    </Button>
  )
}
