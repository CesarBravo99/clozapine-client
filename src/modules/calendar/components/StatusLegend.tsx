import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/calendar/lang'
import { StatusBadge } from './StatusBadge'

export function StatusLegend() {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.statusLegend

  const statuses = [
    { key: 'pending', label: text.pending },
    { key: 'confirmed', label: text.confirmed },
    { key: 'completed', label: text.completed },
    { key: 'cancelled', label: text.cancelled },
  ]

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
        {text.title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <StatusBadge key={status.key} status={status.key} label={status.label} />
        ))}
      </div>
    </div>
  )
}
