import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shield, Users, Building, Check } from 'lucide-react';
import type { Affiliation } from '@/domain/affiliation/affiliation.types';
import { getConfigOverview, type ConfigOverview } from '@/api/config';
import { ConfigProvider } from '@/modules/config/providers';
import { useConfigContext } from '@/modules/config/contexts';
import {
	LeftSidebar,
	SecuritySettings,
	PasswordPolicies,
	PersonnelList,
	AffiliationSettings,
} from '@/modules/config/components';
import {
	AddPersonnelDialog,
	EditPersonnelDialog,
	DeletePersonnelDialog,
	ResetPasswordDialog,
} from '@/modules/config/dialog';
import { langs } from '@/modules/config/lang';

interface LoaderResult {
	config: ConfigOverview | null;
	error: string | null;
	userRut: number | null;
	affiliations: Affiliation[];
	selectedAffiliationId: number;
}

export const Route = createFileRoute('/config')({
	component: RouteComponent,
	loader: async ({ context }) => {
		const { store, queryClient, axiosClient } = context;
		const state = store.getState();

		const affiliationsRecord: Record<number, Affiliation> = state.user?.affiliations ?? {};
		const affiliations: Affiliation[] = Object.values(affiliationsRecord);

		let selectedAffiliationId = state.session?.selectedAffiliationId ?? -1;
		if ((!selectedAffiliationId || selectedAffiliationId <= 0) && affiliations.length > 0) {
			selectedAffiliationId = affiliations[0].affiliationId;
		}

		const isLoggedIn = state.session?.isLoggedIn;
		if (!isLoggedIn) {
			return {
				config: null,
				error: null,
				userRut: null,
				affiliations,
				selectedAffiliationId,
			} satisfies LoaderResult;
		}

		const userRut = state.session?.userRut;
		if (!userRut) {
			return {
				config: null,
				error: null,
				userRut: null,
				affiliations,
				selectedAffiliationId,
			} satisfies LoaderResult;
		}

		try {
			const config = await queryClient.ensureQueryData({
				queryKey: ['config', userRut, selectedAffiliationId],
				queryFn: () => getConfigOverview(userRut, selectedAffiliationId, axiosClient),
				staleTime: 1000 * 60 * 5,
			});

			return {
				config,
				error: null,
				userRut,
				affiliations,
				selectedAffiliationId,
			} satisfies LoaderResult;
		} catch (error) {
			console.error('Failed to load config data', error);
			return {
				config: null,
				error: 'No se pudo cargar la configuración. Intente nuevamente.',
				userRut,
				affiliations,
				selectedAffiliationId,
			} satisfies LoaderResult;
		}
	},
});

function RouteComponent() {
	const loaderData = Route.useLoaderData() as LoaderResult;
	const { config, error, userRut, selectedAffiliationId } = loaderData;

	if (!userRut) {
		return <ConfigLoadingContent />;
	}

	return (
		<ConfigProvider
			configData={config}
			userRut={userRut}
			selectedAffiliationId={selectedAffiliationId}
		>
			<ConfigContent error={error} />
		</ConfigProvider>
	);
}

interface ConfigContentProps {
	error: string | null;
}

function ConfigContent({ error }: ConfigContentProps) {
	const lang = useSelector(selectLang);
	const {
		activeTab,
		setActiveTab,
		sidebarCollapsed,
		searchTerm,
		setSearchTerm,
		setAddPersonnelDialogOpen,
		successMessage,
		hideSuccessMessage,
	} = useConfigContext();
	const text = langs[lang];

	const tabs = useMemo(
		() => [
			{ id: 'security', label: text.tabs.security, icon: Shield },
			{ id: 'users', label: text.tabs.users, icon: Users },
			{ id: 'hospital', label: text.tabs.hospital, icon: Building },
		],
		[text.tabs.hospital, text.tabs.security, text.tabs.users]
	);

	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					<Sidebar pendingCount={0}>
						<LeftSidebar collapsed={sidebarCollapsed} />
					</Sidebar>

					<main className='flex flex-col flex-grow'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col'>
							<div className='p-6 border-b border-gray-100 dark:border-gray-800'>
								<div className='flex flex-wrap justify-between items-center gap-3 mb-6'>
									<h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
										{text.page.title}
									</h1>
									<Badge variant='outline'>v1.0</Badge>
								</div>

								<Tabs
									value={activeTab}
									onValueChange={(value) =>
										setActiveTab(value as typeof activeTab)
									}
								>
									<TabsList className='grid w-full grid-cols-3 mb-2'>
										{tabs.map((tab) => {
											const Icon = tab.icon;
											return (
												<TabsTrigger key={tab.id} value={tab.id}>
													<Icon className='mr-2 h-4 w-4' />
													{tab.label}
												</TabsTrigger>
											);
										})}
									</TabsList>
								</Tabs>
							</div>

							<div className='flex-1 p-6 overflow-auto'>
								{error && (
									<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
										<p className='text-red-700 dark:text-red-400'>{error}</p>
									</div>
								)}

								<Tabs
									value={activeTab}
									onValueChange={(value) =>
										setActiveTab(value as typeof activeTab)
									}
								>
									<TabsContent value='security'>
										<div className='flex flex-col md:flex-row gap-6 items-start'>
											<SecuritySettings />
											<PasswordPolicies />
										</div>
									</TabsContent>

									<TabsContent value='users'>
										<div className='space-y-6'>
											<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
												<div className='relative w-full md:max-w-md'>
													<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400' />
													<Input
														value={searchTerm}
														onChange={(event) =>
															setSearchTerm(event.target.value)
														}
														className='pl-10'
														placeholder={text.page.searchPlaceholder}
													/>
												</div>

												<Button
													className='bg-blue-500 hover:bg-blue-600 text-white'
													onClick={() => setAddPersonnelDialogOpen(true)}
												>
													{text.page.addPersonnel}
												</Button>
											</div>

											<PersonnelList />
										</div>
									</TabsContent>

									<TabsContent value='hospital'>
										<AffiliationSettings />
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</main>
				</div>
			</div>

			<AddPersonnelDialog />
			<EditPersonnelDialog />
			<DeletePersonnelDialog />
			<ResetPasswordDialog />

			{successMessage && (
				<div className='fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300'>
					<Check className='h-4 w-4' />
					<span>{successMessage}</span>
					<button
						type='button'
						onClick={hideSuccessMessage}
						className='text-white/80 text-sm'
					>
						×
					</button>
				</div>
			)}
		</div>
	);
}

function ConfigLoadingContent() {
	const lang = useSelector(selectLang);
	const text = langs[lang];

	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					<Sidebar pendingCount={0} />
					<main className='flex flex-col flex-grow'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col'>
							<div className='flex-1 p-6 flex items-center justify-center'>
								<div className='text-center'>
									<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4'></div>
									<p className='text-gray-600 dark:text-gray-400'>
										{text.page.title}...
									</p>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
