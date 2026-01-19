import { format, isSameMonth } from 'date-fns'
import { useCalendarContext } from '@/modules/calendar/contexts'

export function MonthView() {
  const {
    date,
    monthDays,
    getEventsByDate,
    handleTimeSlotSelection,
    setSelectedEvent,
    setEventDetailsOpen,
  } = useCalendarContext()

  return (
    <div className="grid grid-cols-7 gap-2">
      {monthDays.map((day) => {
        const events = getEventsByDate(day)
        const isCurrentMonth = isSameMonth(day, date)
        return (
          <div
            key={day.toISOString()}
            className={`border rounded-lg p-2 min-h-[110px] flex flex-col ${
              isCurrentMonth
                ? 'border-gray-200 dark:border-gray-700'
                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs ${isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </span>
              <button
                type="button"
                className="text-xs text-gray-400 hover:text-blue-500"
                onClick={() => handleTimeSlotSelection(day, '10:00')}
              >
                +
              </button>
            </div>
            <div className="space-y-1 overflow-hidden">
              {events.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    setSelectedEvent(event)
                    setEventDetailsOpen(true)
                  }}
                  className="block w-full text-left text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded px-1 py-0.5 text-blue-700 dark:text-blue-300 truncate"
                >
                  {event.patientName}
                </button>
              ))}
              {events.length > 3 && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  +{events.length - 3} más
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
