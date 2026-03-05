import { Link } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { langs } from '@/lang'
import { selectLang } from '@/redux/settings/settings.slice'

export default function Footer() {
  const lang = useSelector(selectLang)
  const labels = langs[lang].global.footer

  return (
    <footer className="py-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
            <Link
              to="/help"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {labels.help}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
