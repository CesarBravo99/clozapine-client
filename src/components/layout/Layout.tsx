import { type ReactNode, useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { selectLang } from '@/redux/settings/settings.slice'
import { langs } from '@/lang'

type LayoutProps = {
  children: ReactNode
}

export const Layout = (props: LayoutProps) => {
  const location = useLocation()
  const lang = useSelector(selectLang)
  const translations = langs[lang]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  // useEffect(() => {
  // 	const persistedState = loadFromLocalStorage();
  // 	console.log('persistedState', persistedState);
  // 	if (persistedState) {
  // 		dispatch(setSettings(persistedState.settings));
  // 		dispatch(setUserState(persistedState.user));
  // 	}
  // }, [dispatch]);

  return (
    <div
      className="min-h-screen flex flex-col"
      data-lang={lang}
      aria-label={translations.global.layoutLabel}
      tabIndex={-1}
    >
      <Header />
      <main
        className="flex-grow
                    bg-gradient-to-b from-gray-50 to-gray-50
                    dark:from-gray-950 dark:to-gray-950"
      >
        {props.children}
      </main>
      <Footer />
    </div>
  )
}
