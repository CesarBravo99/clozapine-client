import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/modules/help/lang'
import { useHelpContext } from '@/modules/help/contexts'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const lang = useSelector(selectLang)
  const { page, components } = langs[lang]
  const { staffAuthenticated, simulateStaffLogin } = useHelpContext()

  return (
    <div className="text-center mb-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{page.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{page.description}</p>
      </div>
      {!staffAuthenticated && (
        <div className="flex items-center justify-center">
          <Button variant="outline" onClick={simulateStaffLogin}>
            {components.hero.simulateLogin}
          </Button>
        </div>
      )}
    </div>
  )
}
