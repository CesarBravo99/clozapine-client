import { useSelector } from 'react-redux'
import { langs } from '@/modules/calendar/lang'
import { selectLang } from '@/redux/settings/settings.slice'
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
    <div className="space-y-3 mt-5">
      <h4 className="title-description">{text.title}</h4>
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <StatusBadge key={status.key} status={status.key} label={status.label} />
        ))}
      </div>
    </div>
  )
}
