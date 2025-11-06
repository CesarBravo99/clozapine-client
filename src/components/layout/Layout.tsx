import { type ReactNode, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type LayoutProps = {
	children: ReactNode;
};

export const Layout = (props: LayoutProps) => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	// useEffect(() => {
	// 	const persistedState = loadFromLocalStorage();
	// 	console.log('persistedState', persistedState);
	// 	if (persistedState) {
	// 		dispatch(setSettings(persistedState.settings));
	// 		dispatch(setUserState(persistedState.user));
	// 	}
	// }, [dispatch]);

	return (
		<div className={`min-h-screen flex flex-col`} tabIndex={-1}>
			<Header />
			<main
				className='flex-grow
                    bg-gradient-to-b from-gray-50 to-gray-50
                    dark:from-gray-950 dark:to-gray-950'
			>
				{props.children}
			</main>
			<Footer />
		</div>
	);
};
