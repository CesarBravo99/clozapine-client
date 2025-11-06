import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, LogOut } from 'lucide-react';

import { useNavigate } from '@tanstack/react-router';
import { SelectAffiliationDialog } from '@/dialogs/SelectAffiliationDialog';
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings, toggleTheme, setLang } from '@/redux/settings/settings.slice';
import { selectUserState } from '@/redux/user/user.slice';
import { selectSessionState } from '@/redux/session/session.slice';
import { LanguageState } from '@/redux/settings/settings.types';
import { clearLocalStorage } from '@/redux/store/store.storage';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const FLAG_MAP = {
	es: { class: 'fi fi-cl', label: 'Español (Chile)' },
	en: { class: 'fi fi-us', label: 'English (EEUU)' },
};

export default function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const settingsState = useSelector(selectSettings);
	const userState = useSelector(selectUserState);
	const sessionState = useSelector(selectSessionState);

	const [openAffiliationSelector, setOpenAffiliationSelector] = useState(false);

	// Helper function to get user display name
	const getUserDisplayName = () => {
		if (userState?.user?.userNameFormatted) {
			return userState.user.userNameFormatted;
		}
		if (userState?.user?.firstName && userState?.user?.lastName) {
			return `${userState.user.firstName} ${userState.user.lastName}`;
		}
		if (sessionState?.userRut && sessionState.userRut > 0) {
			return `Usuario ${sessionState.userRut}`;
		}
		return 'Usuario';
	};

	// Helper function to get user initials for avatar
	const getUserInitials = () => {
		if (userState?.user?.firstName && userState?.user?.lastName) {
			return `${userState.user.firstName.charAt(0)}${userState.user.lastName.charAt(0)}`.toUpperCase();
		}
		if (userState?.user?.userNameFormatted) {
			const names = userState.user.userNameFormatted.split(' ');
			if (names.length >= 2) {
				return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
			}
			return names[0].substring(0, 2).toUpperCase();
		}
		return 'U';
	};

	// Helper function to get current affiliation name
	const getCurrentAffiliationName = () => {
		if (sessionState?.selectedAffiliationId && sessionState.selectedAffiliationId > 0) {
			const affiliation = userState?.affiliations?.[sessionState.selectedAffiliationId];
			return affiliation?.affiliationName || 'Seleccionar afiliación';
		}
		return 'Seleccionar afiliación';
	};

	return (
		<>
			<header className='py-3 px-6 md:px-12 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950'>
				<div className='w-full mx-auto flex justify-between items-center'>
					<div className='flex items-center gap-2 pr-4'>
						<button
							className='flex items-center gap-2 group'
							onClick={() => {
								console.log('HEADER SESSION: ', sessionState);
								console.log('HEADER USER: ', userState);
								sessionState?.isLoggedIn
									? navigate({ to: '/notifications' })
									: navigate({ to: '/login' });
							}}
						>
							<div className='flex items-center gap-2'>
								<div className='h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-110'>
									<span className='text-white font-bold'>C</span>
								</div>
								<h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent transition-transform duration-200 ease-in-out group-hover:scale-105'>
									Clozapina
								</h1>
							</div>
						</button>
					</div>

					<div className='flex items-center gap-2 md:gap-4'>
						{sessionState?.isLoggedIn && (
							<div className='flex items-center gap-1 md:gap-2'>
								<div className='flex items-center gap-1 md:gap-2 p-0 hover:bg-transparent'>
									<Avatar className='hidden md:block h-8 w-8'>
										<AvatarImage alt={getUserDisplayName()} />
										<AvatarFallback className='bg-blue-100 text-blue-800 text-sm'>
											{getUserInitials()}
										</AvatarFallback>
									</Avatar>
									<div className='flex flex-col items-start'>
										<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
											{getUserDisplayName()}
										</span>
										<Button
											variant='link'
											className='h-auto p-0 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
											onClick={() =>
												setOpenAffiliationSelector(!openAffiliationSelector)
											}
										>
											{getCurrentAffiliationName()}
										</Button>
									</div>
								</div>
							</div>
						)}

						{/* <div className='app'>
							<Moon
								size={40}
								className={`text-blue-500 absolute transition-all duration-300 ${settingsState.theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
							/>
						</div> */}
						<Button
							variant='ghost'
							size='icon'
							className='relative h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300'
							onClick={() => dispatch(toggleTheme())}
						>
							<div className='absolute inset-0 flex items-center justify-center transition-all duration-300'>
								<Sun
									size={40}
									className={`text-amber-500 transition-all duration-300 ${settingsState.theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
								/>
								<Moon
									size={40}
									className={`text-blue-500 absolute transition-all duration-300 ${settingsState.theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
								/>
							</div>
						</Button>

						<Button
							variant='ghost'
							size='icon'
							className='relative h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300'
							onClick={() =>
								dispatch(
									setLang(
										settingsState.lang === LanguageState.ES
											? LanguageState.EN
											: LanguageState.ES
									)
								)
							}
							aria-label={`Switch language to ${settingsState.lang === LanguageState.ES ? 'English' : 'Español'}`}
						>
							<span
								className={`${FLAG_MAP[settingsState.lang].class} h-10 w-10 transition-all duration-300 text-xl`}
								aria-label={FLAG_MAP[settingsState.lang].label}
							/>
						</Button>

						{sessionState?.isLoggedIn && (
							<Button
								onClick={() => {
									clearLocalStorage(dispatch);
									navigate({ to: '/login' });
								}}
								variant='ghost'
								size='icon'
								className='text-gray-600 dark:text-gray-300 sm:gap-1.5 h-8 w-8 sm:h-9 sm:w-auto'
							>
								<LogOut className='h-4 w-4' />
								<span className='hidden md:inline'>Cerrar sesión</span>
							</Button>
						)}
					</div>
				</div>
			</header>
			<SelectAffiliationDialog
				open={openAffiliationSelector}
				onOpenChange={setOpenAffiliationSelector}
			/>
		</>
	);
}
