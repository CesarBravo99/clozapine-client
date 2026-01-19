import { format } from 'date-fns'
import { useCalendarContext } from '@/modules/calendar/contexts'

export function DayView() {
  const {
    date,
    workingHours,
    getEventsByDate,
    handleTimeSlotSelection,
    setSelectedEvent,
    setEventDetailsOpen,
  } = useCalendarContext()

  const events = getEventsByDate(date)

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {workingHours.map((hour) => {
              const timeLabel = `${hour.toString().padStart(2, '0')}:00`
              const slotEvents = events.filter(
                (event) => format(new Date(event.start), 'HH:00') === timeLabel
              )
              return (
                <tr key={hour} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="w-24 px-3 py-4 text-sm text-gray-500 dark:text-gray-400 align-top">
                    {timeLabel}
                  </td>
                  <td
                    className="px-3 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => handleTimeSlotSelection(date, timeLabel)}
                  >
                    {slotEvents.length === 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Disponible</span>
                    )}
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md px-3 py-2 mb-2 last:mb-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(event)
                          setEventDetailsOpen(true)
                        }}
                      >
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {event.patientName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.doctorName}
                        </p>
                      </div>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
