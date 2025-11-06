import { Sidebar } from '@/components/layout/Sidebar';
import { getUserProfile, adaptUserProfileToDisplayData } from '@/api/profile';
import { createFileRoute } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { useState } from 'react';
import { User, Settings, Shield } from 'lucide-react';
import { PreferencesForm } from '@/modules/profile/components/PreferencesForm';
import { SecurityForm } from '@/modules/profile/components/SecurityForm';
import { PasswordChangeForm } from '@/modules/profile/components/PasswordChangeForm';

export const Route = createFileRoute('/profile')({
	component: RouteComponent,
	loader: async ({ context }) => {
		console.log('👤 PROFILE LOADER: Started');

		try {
			console.log('👤 PROFILE LOADER: Context:', context);

			const { store, queryClient, axiosClient } = context;

			console.log(
				'👤 PROFILE LOADER: Store:',
				!!store,
				'QueryClient:',
				!!queryClient,
				'AxiosClient:',
				!!axiosClient
			);

			const state = store.getState();
			console.log('👤 PROFILE LOADER: State:', state);

			// Check if user is actually logged in first
			const isLoggedIn = state.session?.isLoggedIn;
			console.log('👤 PROFILE LOADER: isLoggedIn:', isLoggedIn);

			if (!isLoggedIn) {
				console.log('⚠️ PROFILE LOADER: User not logged in, skipping data fetch');
				return {
					profile: null,
					rawProfile: null,
					error: null,
					userRut: null,
				};
			}

			// Get user RUT from session
			const userRut = state.session?.userRut;
			console.log('👤 PROFILE LOADER: userRut:', userRut);

			// If no user RUT available
			if (!userRut) {
				console.log('⚠️ PROFILE LOADER: No user RUT available');
				return {
					profile: null,
					rawProfile: null,
					error: null,
					userRut: null,
				};
			}

			try {
				console.log('📊 PROFILE LOADER: Fetching for user:', userRut);
				console.log('📊 PROFILE LOADER: getUserProfile function:', typeof getUserProfile);
				console.log(
					'📊 PROFILE LOADER: adaptUserProfileToDisplayData function:',
					typeof adaptUserProfileToDisplayData
				);

				const profileResponse = await queryClient.ensureQueryData({
					queryKey: ['profile', userRut],
					queryFn: async () => {
						console.log('📊 PROFILE LOADER: Calling getUserProfile...');
						const result = await getUserProfile(userRut, axiosClient);
						console.log('📊 PROFILE LOADER: getUserProfile result:', result);
						return result;
					},
					staleTime: 1000 * 60 * 10, // 10 minutes cache
				});

				console.log('📊 PROFILE LOADER: Raw response:', profileResponse);

				// Adapt the data for display
				console.log('📊 PROFILE LOADER: Adapting data...');
				const adaptedData = adaptUserProfileToDisplayData(profileResponse);
				console.log('📊 PROFILE LOADER: Adapted data:', adaptedData);

				console.log('✅ PROFILE LOADER: Data fetched successfully');
				return {
					profile: adaptedData,
					rawProfile: profileResponse,
					error: null,
					userRut: userRut,
				};
			} catch (error) {
				console.error('❌ PROFILE LOADER: Failed to fetch profile:', error);
				console.error('❌ PROFILE LOADER: Error type:', typeof error);
				console.error('❌ PROFILE LOADER: Error instanceof Error:', error instanceof Error);
				console.error(
					'❌ PROFILE LOADER: Error message:',
					error instanceof Error ? error.message : 'Unknown error'
				);
				console.error(
					'❌ PROFILE LOADER: Error stack:',
					error instanceof Error ? error.stack : 'No stack'
				);

				// Don't throw error - return error state instead
				return {
					profile: null,
					rawProfile: null,
					error:
						error instanceof Error
							? error.message
							: 'Failed to load profile. Please try again.',
					userRut: userRut,
				};
			}
		} catch (outerError) {
			console.error('❌ PROFILE LOADER: Outer error:', outerError);
			console.error('❌ PROFILE LOADER: Outer error type:', typeof outerError);
			console.error(
				'❌ PROFILE LOADER: Outer error instanceof Error:',
				outerError instanceof Error
			);
			console.error(
				'❌ PROFILE LOADER: Outer error message:',
				outerError instanceof Error ? outerError.message : 'Unknown error'
			);
			console.error(
				'❌ PROFILE LOADER: Outer error stack:',
				outerError instanceof Error ? outerError.stack : 'No stack'
			);

			// Fallback return to prevent undefined
			return {
				profile: null,
				rawProfile: null,
				error:
					outerError instanceof Error
						? outerError.message
						: 'An unexpected error occurred.',
				userRut: null,
			};
		}
	},
});

type TabType = 'information' | 'preferences' | 'security';

function RouteComponent() {
	const loaderData = Route.useLoaderData();
	const lang = useSelector(selectLang);
	const [activeTab, setActiveTab] = useState<TabType>('information');

	// Safely extract data with fallbacks
	const profile = loaderData?.profile || null;
	const rawProfile = loaderData?.rawProfile || null;
	const error = loaderData?.error || null;
	const userRut = loaderData?.userRut || null;

	console.log('👤 PROFILE COMPONENT: Rendering with data:', {
		userRut,
		hasProfile: !!profile,
		error,
		loaderData,
	});

	const tabs = [
		{
			id: 'information' as TabType,
			label: 'Información Personal',
			icon: User,
		},
		{
			id: 'preferences' as TabType,
			label: 'Preferencias',
			icon: Settings,
		},
		{
			id: 'security' as TabType,
			label: 'Seguridad',
			icon: Shield,
		},
	];

	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					<Sidebar pendingCount={0} />

					<main className='flex flex-col flex-grow'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col'>
							<div className='p-6 border-b border-gray-100 dark:border-gray-800'>
								<div className='flex flex-wrap justify-between items-center gap-3 mb-6'>
									<h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
										Perfil de Usuario
									</h1>
									{userRut && (
										<span className='text-sm text-gray-500 dark:text-gray-400'>
											RUT: {userRut}
										</span>
									)}
								</div>

								{/* Tab Navigation */}
								<div className='flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
									{tabs.map((tab) => {
										const Icon = tab.icon;
										return (
											<button
												key={tab.id}
												onClick={() => setActiveTab(tab.id)}
												className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
													activeTab === tab.id
														? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
														: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
												}`}
											>
												<Icon className='h-4 w-4' />
												<span>{tab.label}</span>
											</button>
										);
									})}
								</div>
							</div>

							<div className='flex-1 p-6 overflow-auto'>
								{error && (
									<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
										<p className='text-red-700 dark:text-red-400'>
											Error al cargar el perfil: {error}
										</p>
									</div>
								)}

								{!userRut && !error && (
									<div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6'>
										<p className='text-yellow-700 dark:text-yellow-400'>
											No hay sesión de usuario activa
										</p>
									</div>
								)}

								{userRut && !profile && !error && (
									<div className='flex items-center justify-center h-64'>
										<div className='text-center'>
											<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4'></div>
											<p className='text-gray-600 dark:text-gray-400'>
												Cargando perfil...
											</p>
										</div>
									</div>
								)}

								{/* Tab Content */}
								{userRut && profile && (
									<div className='space-y-6'>
										{/* User Information Tab */}
										{activeTab === 'information' && (
											<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
												<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
													<h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
														<User className='h-5 w-5 text-blue-500' />
														Información Personal
													</h3>
													<div className='space-y-4'>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Nombre Completo
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.name}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																RUT
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.rut}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Sexo
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.sex}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Fecha de Nacimiento
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.birthDate}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Edad
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.age} años
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Cuenta Creada
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.personalInfo.createdAt}
															</p>
														</div>
													</div>
												</div>

												{/* Affiliations */}
												<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
													<h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
														Afiliaciones
													</h3>
													{profile.affiliations.length > 0 ? (
														<div className='space-y-4'>
															{profile.affiliations.map(
																(affiliation) => (
																	<div
																		key={affiliation.id}
																		className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
																	>
																		<div className='grid grid-cols-1 gap-3'>
																			<div>
																				<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																					Email
																				</label>
																				<p className='text-gray-900 dark:text-white'>
																					{
																						affiliation.email
																					}
																				</p>
																			</div>
																			<div>
																				<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																					Teléfono
																				</label>
																				<p className='text-gray-900 dark:text-white'>
																					{
																						affiliation.phone
																					}
																				</p>
																			</div>
																			<div>
																				<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																					Cargo
																				</label>
																				<p className='text-gray-900 dark:text-white'>
																					{
																						affiliation.position
																					}
																				</p>
																			</div>
																			<div>
																				<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																					Estado
																				</label>
																				<p
																					className={`font-medium ${
																						affiliation.isActive
																							? 'text-green-600 dark:text-green-400'
																							: 'text-red-600 dark:text-red-400'
																					}`}
																				>
																					{affiliation.isActive
																						? 'Activo'
																						: 'Inactivo'}
																				</p>
																			</div>
																		</div>
																	</div>
																)
															)}
														</div>
													) : (
														<p className='text-gray-500 dark:text-gray-400'>
															No hay afiliaciones registradas
														</p>
													)}
												</div>
											</div>
										)}

										{/* User Preferences Tab */}
										{activeTab === 'preferences' && (
											<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
												<h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2'>
													<Settings className='h-5 w-5 text-blue-500' />
													Actualizar Preferencias
												</h3>
												<PreferencesForm
													userRut={userRut}
													profile={profile}
												/>
											</div>
										)}

										{/* User Security Tab */}
										{activeTab === 'security' && (
											<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
												<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
													<h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
														<Shield className='h-5 w-5 text-blue-500' />
														Información de Seguridad
													</h3>
													<div className='space-y-4'>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Rol
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.credentials.role}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Último Acceso
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.credentials.lastLogin}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Contraseña Cambiada
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.credentials.passwordChanged
																	? 'Sí'
																	: 'No'}
															</p>
														</div>
														<div>
															<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
																Cuenta Creada
															</label>
															<p className='text-gray-900 dark:text-white font-medium'>
																{profile.credentials.createdAt}
															</p>
														</div>
													</div>
												</div>

												<div className='space-y-6'>
													<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
														<h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2'>
															<Shield className='h-5 w-5 text-blue-500' />
															Configuración de Seguridad
														</h3>
														<SecurityForm
															userRut={userRut}
															profile={profile}
														/>
													</div>

													<div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6'>
														<PasswordChangeForm userRut={userRut} />
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
