import { CalendarPlus, CalendarSearch } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { useCalendarContext } from '@/modules/calendar/contexts'
import { langs } from '@/modules/calendar/lang'
import { selectLang } from '@/redux/settings/settings.slice'
import { StatusLegend } from './StatusLegend'

interface LeftSidebarProps {
  collapsed?: boolean
}

export function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.leftSidebar
  const { handleToday, setAddEventOpen } = useCalendarContext()

  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 dark:text-blue-400"
          title={text.addEvent}
          onClick={() => setAddEventOpen(true)}
        >
          <CalendarPlus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title={text.goToday}
          onClick={handleToday}
        >
          <CalendarSearch className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="quick-actions-container">
      <div>
        <h3 className="title-description">{text.quickActions}</h3>
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            className="w-full justify-start text-sm bg-blue-600 hover:bg-blue-700 dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => setAddEventOpen(true)}
          >
            <CalendarPlus className="h-4 w-4 mr-1" />
            {text.addEvent}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm"
            onClick={handleToday}
          >
            <CalendarSearch className="h-4 w-4 mr-1" />
            {text.goToday}
          </Button>
        </div>
      </div>

      <StatusLegend />
    </div>
  )
}
