import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
// import { RutInput } from '@/components/RutInput';
import type { Notification } from '@/domain/notification.types';
import { Clock, Timer } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';
import { useNotificationContext } from '../context/NotificationContext';

export function RightSidebar() {
	const lang = useSelector(selectLang);
	const {
		selectedDate,
		setSelectedDate,
		filterByRut,
		setFilterByRut,
		rutFilter,
		setRutFilter,
		showPendingOnly,
		setShowPendingOnly,
		selectedType,
		setSelectedType,
		filteredNotifications,
		resetFilters,
		handleRutChange,
		sidebarCollapsed,
		isExtraSmallScreen,
	} = useNotificationContext();

	// Determine if this component is being rendered within a mobile sidebar
	const [isMobileSidebar, setIsMobileSidebar] = useState(false);

	useEffect(() => {
		const checkScreenWidth = () => {
			setIsMobileSidebar(window.innerWidth <= 1024);
		};

		checkScreenWidth();
		window.addEventListener('resize', checkScreenWidth);
		return () => window.removeEventListener('resize', checkScreenWidth);
	}, []);

	return (
		<div
			className={`flex-shrink-0 space-y-4 ${isExtraSmallScreen ? 'hidden' : 'block'}
                ${isMobileSidebar ? 'w-full' : sidebarCollapsed ? 'w-16' : 'w-full'}`}
		>
			{/* Advanced Filters Card */}
			<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-100 dark:border-gray-800'>
					<h2
						className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${
							sidebarCollapsed && !isMobileSidebar ? 'hidden' : 'block'
						}`}
					>
						{langs[lang].components.rightSidebar.advancedFilters}
					</h2>
				</div>

				{(!sidebarCollapsed || isMobileSidebar) && (
					<div className='p-4 space-y-4'>
						{/* Date filter */}
						<div className='space-y-2'>
							<Label className='text-xs font-medium'>
								{langs[lang].components.rightSidebar.date}
							</Label>
							<Input
								type='date'
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								className='text-sm'
							/>
						</div>

						{/* RUT filter */}
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<Label className='text-xs font-medium'>
									{langs[lang].components.rightSidebar.filterByRut}
								</Label>
								<Switch checked={filterByRut} onCheckedChange={setFilterByRut} />
							</div>

							{filterByRut && (
								<Input
									type='text'
									placeholder='12345678-9'
									value={rutFilter}
									onChange={(e) => handleRutChange(e.target.value)}
									className='text-sm'
								/>
							)}
						</div>

						{/* Reset filters button */}
						<Button
							variant='outline'
							size='sm'
							onClick={resetFilters}
							className='w-full'
						>
							{langs[lang].components.rightSidebar.clearFilters}
						</Button>
					</div>
				)}
			</div>

			{/* Quick filters card */}
			<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden'>
				<div className='p-4 border-b border-gray-100 dark:border-gray-800'>
					<h2
						className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${
							sidebarCollapsed && !isMobileSidebar ? 'hidden' : 'block'
						}`}
					>
						{langs[lang].components.rightSidebar.quickFilters}
					</h2>
				</div>

				<div className='p-4 space-y-3'>
					{/* Pending filter */}
					<Button
						variant={showPendingOnly ? 'default' : 'outline'}
						className={`${
							sidebarCollapsed && !isMobileSidebar
								? 'justify-center w-8 h-8 p-1'
								: 'w-full justify-start dark:text-gray-300 dark:border-gray-700'
						} ${
							showPendingOnly
								? 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-400 border border-blue-200 hover:bg-blue-50'
								: ''
						}`}
						onClick={() => setShowPendingOnly(!showPendingOnly)}
					>
						<Timer
							className={`h-4 w-4 ${
								sidebarCollapsed && !isMobileSidebar ? '' : 'mr-2'
							}`}
						/>
						{(!sidebarCollapsed || isMobileSidebar) && (
							<>
								<span>{langs[lang].components.rightSidebar.pending}</span>
								<Badge className='ml-auto'>
									{
										filteredNotifications.filter(
											(n) => !n.metadata.taskCompleted
										).length
									}
								</Badge>
							</>
						)}
					</Button>

					{/* Last week filter */}
					<Button
						variant='outline'
						className={`${
							sidebarCollapsed && !isMobileSidebar
								? 'justify-center w-8 h-8 p-1'
								: 'w-full justify-start dark:text-gray-300 dark:border-gray-700'
						}`}
						onClick={resetFilters}
					>
						<Clock
							className={`h-4 w-4 ${
								sidebarCollapsed && !isMobileSidebar ? '' : 'mr-2'
							}`}
						/>
						{(!sidebarCollapsed || isMobileSidebar) && (
							<span>{langs[lang].components.rightSidebar.lastWeek}</span>
						)}
					</Button>

					{/* Type filter separator */}
					{(!sidebarCollapsed || isMobileSidebar) && (
						<div className='py-2'>
							<div className='flex items-center gap-2'>
								<div className='h-px bg-gray-200 dark:bg-gray-700 flex-grow'></div>
								<span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
									{langs[lang].components.rightSidebar.byType}
								</span>
								<div className='h-px bg-gray-200 dark:bg-gray-700 flex-grow'></div>
							</div>
						</div>
					)}

					{/* Type filter buttons */}
					{[
						{
							key: 'urgente',
							color: 'bg-red-500',
							label: langs[lang].components.rightSidebar.urgent,
						},
						{
							key: 'importante',
							color: 'bg-orange-500',
							label: langs[lang].components.rightSidebar.important,
						},
						{
							key: 'recordatorio',
							color: 'bg-yellow-500',
							label: langs[lang].components.rightSidebar.reminder,
						},
						{
							key: 'normal',
							color: 'bg-blue-500',
							label: langs[lang].components.rightSidebar.normal,
						},
						{
							key: 'solicitud',
							color: 'bg-purple-500',
							label: langs[lang].components.rightSidebar.requests,
						},
					].map(({ key, color, label }) => (
						<Button
							key={key}
							variant={selectedType === key ? 'default' : 'outline'}
							className={`${
								sidebarCollapsed && !isMobileSidebar
									? 'justify-center w-8 h-8 p-1'
									: 'w-full justify-start dark:text-gray-300 dark:border-gray-700'
							} ${
								selectedType === key
									? 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-400 border border-blue-200 hover:bg-blue-50'
									: ''
							}`}
							onClick={() => setSelectedType(selectedType === key ? 'all' : key)}
						>
							<span className={`w-3 h-3 rounded-full ${color} mr-2`}></span>
							{(!sidebarCollapsed || isMobileSidebar) && <span>{label}</span>}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
