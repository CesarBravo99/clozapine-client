import { format } from 'date-fns';
import { useCalendarContext } from '@/modules/calendar/contexts';

export function WeekView() {
	const {
		weekDays,
		getEventsByDate,
		handleTimeSlotSelection,
		setSelectedEvent,
		setEventDetailsOpen,
	} = useCalendarContext();

	return (
		<div className='grid grid-cols-1 md:grid-cols-7 gap-4'>
			{weekDays.map((day) => {
				const events = getEventsByDate(day);
				return (
					<div
						key={day.toISOString()}
						className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col min-h-[180px]'
					>
						<div className='flex items-center justify-between mb-2'>
							<div>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									{format(day, 'EEE')}
								</p>
								<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
									{format(day, 'd')}
								</p>
							</div>
							<button
								type='button'
								className='text-xs text-blue-600 hover:underline'
								onClick={() => handleTimeSlotSelection(day, '10:00')}
							>
								+
							</button>
						</div>
						<div className='space-y-2'>
							{events.length === 0 && (
								<p className='text-xs text-gray-400 dark:text-gray-500'>Sin eventos</p>
							)}
							{events.map((event) => (
								<button
									key={event.id}
									type='button'
									onClick={() => {
										setSelectedEvent(event);
										setEventDetailsOpen(true);
									}}
									className='w-full text-left bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md px-2 py-1 text-sm'
								>
									<div className='font-medium text-blue-700 dark:text-blue-300'>
										{event.patientName}
									</div>
									<div className='text-xs text-gray-500 dark:text-gray-400'>
										{format(new Date(event.start), 'HH:mm')} · {event.doctorName}
									</div>
								</button>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

