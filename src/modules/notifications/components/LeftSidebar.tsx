import { Calendar, User2, UserRoundPlus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { langs } from '@/modules/notifications/lang'
import { selectLang } from '@/redux/settings/settings.slice'
import { useNotificationContext } from '../context'

interface LeftSidebarProps {
  collapsed?: boolean
}

export function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
  const lang = useSelector(selectLang)
  const { openAddEventDialog, handleAddPatient, handleSearchPatient } = useNotificationContext()

  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          onClick={() => openAddEventDialog()}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
          title={langs[lang].components.leftSidebar.scheduleAppointment}
        >
          <Calendar className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleAddPatient}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
          title={langs[lang].components.leftSidebar.addPatient}
        >
          <UserRoundPlus className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleSearchPatient}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
          title={langs[lang].components.leftSidebar.searchPatient}
        >
          <User2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="quick-actions-container">
      <div>
        <h3 className="title-description">{langs[lang].components.leftSidebar.quickActions}</h3>
        <div className="space-y-2">
          <Button
            onClick={() => openAddEventDialog()}
            variant="default"
            size="sm"
            className="w-full justify-start text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {langs[lang].components.leftSidebar.scheduleAppointment}
          </Button>

          <Button
            onClick={handleAddPatient}
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm transition-colors"
          >
            <UserRoundPlus className="h-4 w-4 mr-2" />
            {langs[lang].components.leftSidebar.addPatient}
          </Button>

          <Button
            onClick={handleSearchPatient}
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm transition-colors"
          >
            <User2 className="h-4 w-4 mr-2" />
            {langs[lang].components.leftSidebar.searchPatient}
          </Button>
        </div>
      </div>
    </div>
  )
}
