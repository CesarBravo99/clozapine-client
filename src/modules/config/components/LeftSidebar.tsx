import { Button } from '@/components/ui/button'
import { Building, LockKeyhole, Users2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/config/lang'
import { useConfigContext, type ConfigTab } from '@/modules/config/contexts'

interface LeftSidebarProps {
  collapsed?: boolean
}

const TAB_ICON: Record<ConfigTab, typeof LockKeyhole> = {
  security: LockKeyhole,
  users: Users2,
  hospital: Building,
}

export function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.leftSidebar
  const { activeTab, setActiveTab } = useConfigContext()

  const tabs: Array<{ id: ConfigTab; label: string }> = [
    { id: 'security', label: text.security },
    { id: 'users', label: text.users },
    { id: 'hospital', label: text.hospital },
  ]

  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => {
          const Icon = TAB_ICON[tab.id]
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 w-8 ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : ''}`}
              title={tab.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="px-4 py-3 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          {text.title}
        </h3>
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = TAB_ICON[tab.id]
            const isActive = tab.id === activeTab
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-sm ${
                  isActive
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
