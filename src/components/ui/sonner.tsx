import { useSelector } from 'react-redux'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import type { RootState } from '@/redux/store/store'
import { ThemeState } from '@/redux/settings/settings.types'

function Toaster({ ...props }: ToasterProps) {
  const theme = useSelector((state: RootState) => state.settings.theme)

  return (
    <Sonner
      theme={theme === ThemeState.Dark ? 'dark' : 'light'}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-border': 'var(--border)',
          '--normal-text': 'var(--popover-foreground)',
          '--success-bg': 'var(--popover)',
          '--success-border': 'var(--border)',
          '--success-text': 'var(--popover-foreground)',
          '--error-bg': 'var(--popover)',
          '--error-border': 'var(--border)',
          '--error-text': 'var(--popover-foreground)',
          '--warning-bg': 'var(--popover)',
          '--warning-border': 'var(--border)',
          '--warning-text': 'var(--popover-foreground)',
          '--info-bg': 'var(--popover)',
          '--info-border': 'var(--border)',
          '--info-text': 'var(--popover-foreground)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
