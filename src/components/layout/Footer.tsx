import { Link } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/lang'

export default function Footer() {
  const lang = useSelector(selectLang)
  const labels = langs[lang].global.footer

  return (
    <footer className="py-3 px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2">
            <Link
              to="/info/common-questions"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {labels.faq}
            </Link>
            <Link
              to="/info/privacy-policy"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {labels.privacy}
            </Link>

            <Link
              to="/help"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {labels.help}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* <Link
							to='https://vsol.cl/'
							target='_blank'
							className='flex items-center gap-2'
						>
							<span className='text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors'>
								Una solución de
							</span>
							<img src={'favicon.ico'} alt='V Logo' className='w-8 h-8' />
						</Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
