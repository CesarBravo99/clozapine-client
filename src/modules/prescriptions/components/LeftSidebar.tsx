import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '../lang';
import { usePrescriptionsContext } from '../contexts/PrescriptionsContext';

interface LeftSidebarProps {
	collapsed?: boolean;
}

export function LeftSidebar({ collapsed = false }: LeftSidebarProps) {
	const lang = useSelector(selectLang);
	const { statusFilter, setStatusFilter, handleAddPrescription } = usePrescriptionsContext();

	const prescriptionStatuses: Record<string, string> = {
		all: langs[lang].prescriptions.statuses.all,
		active: langs[lang].prescriptions.statuses.active,
		suspended: langs[lang].prescriptions.statuses.suspended,
		completed: langs[lang].prescriptions.statuses.completed,
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			active: {
				label: langs[lang].prescriptions.statuses.active,
				className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
			},
			suspended: {
				label: langs[lang].prescriptions.statuses.suspended,
				className:
					'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
			},
			completed: {
				label: langs[lang].prescriptions.statuses.completed,
				className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
			},
		};

		const config = statusConfig[status as keyof typeof statusConfig];
		if (!config) return status;

		return (
			<span
				className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
			>
				{config.label}
			</span>
		);
	};

	if (collapsed) {
		return (
			<div className='p-2 flex flex-col items-center space-y-2 mt-4 border-t border-gray-100 dark:border-gray-800'>
				<Button
					onClick={handleAddPrescription}
					variant='ghost'
					size='icon'
					className='h-8 w-8 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800'
					title={langs[lang].components.leftSidebar.addPrescription}
				>
					<PlusCircle className='h-5 w-5' />
				</Button>
			</div>
		);
	}

	return (
		<div className='px-4 py-3 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-4'>
			<div>
				<h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide'>
					{langs[lang].components.leftSidebar.filterByStatus}
				</h3>
				<div className='space-y-1'>
					{Object.entries(prescriptionStatuses).map(([value, label]) => {
						const isActive = statusFilter === value;
						const activeStyle =
							'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50';
						const inactiveStyle =
							'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50';

						return (
							<Button
								key={value}
								variant='ghost'
								size='sm'
								onClick={() => setStatusFilter(value)}
								className={`w-full justify-start text-sm h-auto py-2 px-3 rounded-md transition-colors ${
									isActive ? activeStyle : inactiveStyle
								}`}
							>
								{value === 'all' ? (
									<span className='flex items-center gap-2'>
										<span className='w-2 h-2 rounded-full bg-blue-500'></span>
										{label}
									</span>
								) : (
									<span className='flex items-center gap-2'>
										{getStatusBadge(value)}
									</span>
								)}
							</Button>
						);
					})}
				</div>
			</div>

			<div>
				<h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide'>
					{langs[lang].components.leftSidebar.quickActions}
				</h3>
				<Button
					onClick={handleAddPrescription}
					variant='default'
					size='sm'
					className='w-full justify-start text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors'
				>
					<PlusCircle className='h-4 w-4 mr-2' />
					{langs[lang].components.leftSidebar.addPrescription}
				</Button>
			</div>
		</div>
	);
}
