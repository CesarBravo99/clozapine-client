import { Bell, Settings, Shield, UserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { type ProfileTab, useProfileContext } from '@/modules/profile/context'
import { langs } from '@/modules/profile/lang'
import { selectLang } from '@/redux/settings/settings.slice'

interface LeftSidebarProps {
  collapsed?: boolean
}

const iconMap = {
  personal: UserRound,
  preferences: Settings,
  security: Shield,
  notifications: Bell,
}

export function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
  const lang = useSelector(selectLang)
  const text = langs[lang].components.leftSidebar
  const { activeTab, setActiveTab, setAffiliationDialogOpen } = useProfileContext()

  const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: 'personal', label: text.profile },
    { id: 'preferences', label: text.preferences },
    { id: 'security', label: text.security },
  ]

  if (collapsed) {
    return (
      <div className="p-2 flex flex-col items-center space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.id as keyof typeof iconMap] ?? UserRound
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="icon"
              className={`h-8 w-8 ${activeTab === tab.id ? 'bg-blue-600 text-white' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <Icon className="size-4" />
            </Button>
          )
        })}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          title={text.changeAffiliation}
          onClick={() => setAffiliationDialogOpen(true)}
        >
          <Bell className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="quick-actions-container">
      <div>
        <h3 className="title-description">{text.sectionTitle}</h3>
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.id as keyof typeof iconMap] ?? UserRound
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                size="sm"
                className={`w-full justify-start text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'dark:border-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="size-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setAffiliationDialogOpen(true)}
        >
          {text.changeAffiliation}
        </Button>
      </div>
    </div>
  )
}
