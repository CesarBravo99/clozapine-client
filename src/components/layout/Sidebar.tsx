import { type FC, useState, useEffect, type ReactNode, useRef } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Bell, Calendar, Settings, Users2, User, FileText, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/lang'

interface SidebarProps {
  pendingCount: number
  children?: ReactNode
  // rightSidebarContent?: ReactNode;
}

export const Sidebar: FC<SidebarProps> = ({
  pendingCount,
  children,
  // rightSidebarContent,
}) => {
  const location = useLocation()
  const currentPath = location.pathname
  const overlayRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const lang = useSelector(selectLang)

  // Media queries for responsive behavior
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')

  // State for mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false)

  // Update mobile open state based on screen size
  useEffect(() => {
    if (!isSmallScreen) {
      setMobileOpen(false)
    }
  }, [isSmallScreen])

  const isActive = (path: string) => {
    if (path === '/patients') {
      return currentPath === path || currentPath.startsWith(path + '/')
    }
    return currentPath === path
  }

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay element
    if (overlayRef.current && e.target === overlayRef.current) {
      setMobileOpen(false)
    }
  }

  const navigationItems = [
    {
      path: '/notifications',
      icon: Bell,
      label: langs[lang].navigation.notifications,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    { path: '/patients', icon: Users2, label: langs[lang].navigation.patients },
    { path: '/calendar', icon: Calendar, label: langs[lang].navigation.calendar },
    { path: '/prescriptions', icon: FileText, label: langs[lang].navigation.prescriptions },
    { path: '/profile', icon: User, label: langs[lang].navigation.profile },
    { path: '/config', icon: Settings, label: langs[lang].navigation.settings },
  ]

  const renderNavigation = () => (
    <nav className="space-y-1">
      {navigationItems.map(({ path, icon: Icon, label, badge }) => (
        <button
          key={path}
          type="button"
          onClick={async () => await navigate({ to: path })}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-left ${
            isActive(path)
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
          }`}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span>{label}</span>
          {badge && (
            <Badge variant="destructive" className="ml-auto">
              {badge}
            </Badge>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile menu toggle button - only visible when menu is closed */}
      {!mobileOpen && (
        <div className="fixed top-20 left-4 z-40 lg:hidden">
          <Button
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile overlay - clickable to close sidebar */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={handleOverlayClick}
        >
          <div
            className="w-[250px] max-w-[80%] h-full bg-white dark:bg-gray-900
						border border-gray-200 dark:border-gray-800
						rounded-r-xl shadow-sm overflow-auto mr-auto"
          >
            <div className="p-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{langs[lang].navigation.mainMenu}</h2>

                {/* Mobile close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {renderNavigation()}
            </div>

            {/* Quick Actions*/}
            {children}

            {/* Include RightSidebar content if provided */}
            {/* {rightSidebarContent && (
							<div className='mt-4'>{rightSidebarContent}</div>
						)} */}
          </div>
        </div>
      )}

      {/* Desktop sidebar - always visible on lg+ screens */}
      <aside className="hidden lg:block flex-shrink-0 space-y-4 lg:w-[220px]">
        <div
          className="bg-white dark:bg-gray-900
					border border-gray-200 dark:border-gray-800
					rounded-xl shadow-sm overflow-hidden w-full h-auto"
        >
          <div className="p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{langs[lang].navigation.mainMenu}</h2>
            </div>

            {renderNavigation()}
          </div>

          {/* Quick Actions*/}
          {children}
        </div>
      </aside>
    </>
  )
}
