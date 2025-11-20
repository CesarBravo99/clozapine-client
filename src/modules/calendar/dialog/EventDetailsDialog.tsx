import { format } from 'date-fns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/calendar/lang';
import { useCalendarContext } from '@/modules/calendar/contexts';
import { StatusBadge } from '@/modules/calendar/components';

export function EventDetailsDialog() {
	const lang = useSelector(selectLang);
	const text = langs[lang].dialogs.eventDetails;
	const {
		isEventDetailsOpen,
		setEventDetailsOpen,
		selectedEvent,
		updateEventStatus,
		deleteEvent,
	} = useCalendarContext();

	if (!selectedEvent) {
		return null;
	}

	const start = new Date(selectedEvent.start);
	const end = new Date(selectedEvent.end);

	return (
		<Dialog open={isEventDetailsOpen} onOpenChange={setEventDetailsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{text.title}</DialogTitle>
					<DialogDescription>
						{selectedEvent.patientName} · {format(start, 'PPpp')}
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-gray-500 dark:text-gray-400'>{text.statusLabel}</span>
						<StatusBadge status={selectedEvent.status} label={selectedEvent.status} />
					</div>
					<div className='text-sm text-gray-600 dark:text-gray-300'>
						<p>
							<strong>Paciente:</strong> {selectedEvent.patientName}
						</p>
						<p>
							<strong>Médico:</strong> {selectedEvent.doctorName}
						</p>
						<p>
							<strong>Horario:</strong> {format(start, 'PPpp')} – {format(end, 'pp')}
						</p>
						{selectedEvent.notes && (
							<p>
								<strong>Notas:</strong> {selectedEvent.notes}
							</p>
						)}
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => updateEventStatus('confirmed')}
						>
							Confirmar
						</Button>
						<Button variant='outline' size='sm' onClick={() => updateEventStatus('completed')}>
							Completar
						</Button>
						<Button variant='outline' size='sm' onClick={() => updateEventStatus('cancelled')}>
							Cancelar
						</Button>
					</div>
				</div>

				<DialogFooter className='justify-between'>
					<Button variant='outline' onClick={() => setEventDetailsOpen(false)}>
						{text.cancel}
					</Button>
					<Button variant='destructive' onClick={deleteEvent}>
						{text.delete}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

