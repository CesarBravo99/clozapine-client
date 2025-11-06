import { Sidebar } from '@/components/layout/Sidebar';
import {
	getNotificationsByUser,
	formatNotificationDate,
	getNotificationColor,
	getNotificationTypeText,
	groupNotificationsByDateAndPatient,
	getPendingNotificationCount,
} from '@/api/notifications';
import { createFileRoute } from '@tanstack/react-router';
import type { Notification } from '@/domain/notification.types';
import { selectLang } from '@/redux/settings/settings.slice';
import { useSelector } from 'react-redux';
import { langs } from '@/modules/notifications/lang';
import { RightSidebar, LeftSidebar, NotificationList } from '@/modules/notifications/components';
import { NotificationProvider, useNotificationContext } from '@/modules/notifications/context';

export const Route = createFileRoute('/notifications')({
	component: RouteComponent,
	loader: async ({ context }) => {
		console.log('🔔 NOTIFICATIONS LOADER: Started');

		const { store, queryClient, axiosClient } = context;
		const state = store.getState();

		// Check if user is actually logged in first
		const isLoggedIn = state.session?.isLoggedIn;
		if (!isLoggedIn) {
			console.log('⚠️ NOTIFICATIONS LOADER: User not logged in, skipping data fetch');
			return {
				notifications: [],
				error: null,
				userRut: null,
			};
		}

		// Get user RUT from session or user state (resilient approach)
		let userRut = state.session?.userRut || state.user?.user?.userRut;

		// If no user data available, this might be during initial load
		if (!userRut) {
			console.log('⚠️ NOTIFICATIONS LOADER: No user data available yet');
			// Return empty data - the component will handle this gracefully
			return {
				notifications: [],
				error: null,
				userRut: null,
			};
		}

		try {
			console.log('📊 NOTIFICATIONS LOADER: Fetching for user:', userRut);

			const notificationResponse = await queryClient.ensureQueryData({
				queryKey: ['notifications', userRut],
				queryFn: () => getNotificationsByUser(userRut, axiosClient),
				staleTime: 1000 * 60 * 2, // 2 minutes cache
			});

			console.log('✅ NOTIFICATIONS LOADER: Data fetched successfully');
			return {
				notifications: notificationResponse,
				error: null,
				userRut,
			};
		} catch (error) {
			console.error('❌ NOTIFICATIONS LOADER: Failed to fetch notifications:', error);

			// Don't throw error - return error state instead
			return {
				notifications: [],
				error: 'Failed to load notifications. Please try again.',
				userRut,
			};
		}
	},
});

function NotificationContent() {
	const { notifications, error, userRut } = Route.useLoaderData();
	const lang = useSelector(selectLang);
	const {
		filteredNotifications,
		handleViewNotificationDetails,
		handleViewPatientDetails,
		completeNotification,
		resetFilters,
		openAddEventDialog,
	} = useNotificationContext();

	console.log('🔔 NOTIFICATIONS COMPONENT: Rendering with data:', {
		notifications,
		error,
		userRut,
		notificationCount: notifications?.length || 0,
		filteredCount: filteredNotifications?.length || 0,
	});

	// Use adapter functions with language parameter
	const formatDate = (dateString: string) => formatNotificationDate(dateString, lang);
	const getTypeText = (type: number, isPassive?: boolean) =>
		getNotificationTypeText(type, lang, isPassive);

	const groupedNotifications = groupNotificationsByDateAndPatient(filteredNotifications);

	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					{/* Left Sidebar */}
					<Sidebar pendingCount={getPendingNotificationCount(notifications || [])}>
						<LeftSidebar />
					</Sidebar>

					{/* Main Content */}
					<main className='flex flex-col flex-grow min-w-0'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden h-full flex flex-col'>
							<div className='p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3'>
								<h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
									{langs[lang].notifications.title}
								</h1>
								<span className='text-sm text-gray-500 dark:text-gray-400'>
									{langs[lang].notifications.userLabel} {userRut}
								</span>
							</div>

							<div className='flex-1 p-4 overflow-auto'>
								{error && (
									<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
										<p className='text-red-700 dark:text-red-400'>
											{langs[lang].notifications.errorMessage}
										</p>
									</div>
								)}

								<NotificationList
									groupedNotifications={groupedNotifications}
									handleViewNotificationDetails={handleViewNotificationDetails}
									handleViewPatientDetails={handleViewPatientDetails}
									completeNotification={completeNotification}
									resetFilters={resetFilters}
									formatDate={formatDate}
									getNotificationColor={getNotificationColor}
									getNotificationTypeText={getTypeText}
									openAddEventDialog={openAddEventDialog}
								/>
							</div>
						</div>
					</main>

					{/* Right Sidebar */}
					<div className='hidden lg:block lg:w-[280px] flex-shrink-0'>
						<RightSidebar />
					</div>
				</div>
			</div>
		</div>
	);
}

function LoadingContent() {
	const lang = useSelector(selectLang);

	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					<Sidebar pendingCount={0}>
						<LeftSidebar />
					</Sidebar>
					<main className='flex flex-col flex-grow'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden'>
							<div className='p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3'>
								<h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
									{langs[lang].notifications.title}
								</h1>
							</div>
							<div className='flex-1 p-4 flex items-center justify-center'>
								<div className='text-center'>
									<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4'></div>
									<p className='text-gray-600 dark:text-gray-400'>
										{langs[lang].notifications.loadingText}
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

function RouteComponent() {
	const { notifications, error, userRut } = Route.useLoaderData();

	// Show loading state if no user data yet
	if (!userRut) {
		console.log('🔔 NOTIFICATIONS COMPONENT: Showing loading state (no userRut)');
		return (
			<NotificationProvider notifications={[]}>
				<LoadingContent />
			</NotificationProvider>
		);
	}

	console.log('🔔 NOTIFICATIONS COMPONENT: Showing main component for user:', userRut);

	return (
		<NotificationProvider notifications={notifications || []}>
			<NotificationContent />
		</NotificationProvider>
	);
}
