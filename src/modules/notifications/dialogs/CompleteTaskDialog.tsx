import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { Notification } from '@/domain/notification.types';

interface CompleteTaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	notification: Notification;
	onCompleteTask: (id: number, notes?: string) => void;
}

export function CompleteTaskDialog({
	open,
	onOpenChange,
	notification,
	onCompleteTask,
}: CompleteTaskDialogProps) {
	const [notes, setNotes] = useState('');

	const handleComplete = () => {
		onCompleteTask(notification.notificationId, notes);
		onOpenChange(false);
		setNotes(''); // Reset notes when dialog closes
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Check className='h-5 w-5 text-green-500' />
						Completar tarea
					</DialogTitle>
					<DialogDescription>
						Está a punto de marcar esta notificación como completada.
					</DialogDescription>
				</DialogHeader>

				<div className='py-4'>
					<div className='rounded-md bg-amber-50 p-4 text-amber-800 mb-4'>
						<p className='text-sm font-medium'>
							{notification.title || 'Notificación'}
						</p>
						<p className='text-sm mt-1'>{notification.content}</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='notes'>Notas adicionales (opcional)</Label>
						<Textarea
							id='notes'
							placeholder='Agregue notas o comentarios sobre la tarea completada...'
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className='min-h-[100px]'
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						<X className='h-4 w-4 mr-1' />
						Cancelar
					</Button>
					<Button
						onClick={handleComplete}
						className='bg-green-600 hover:bg-green-700'
					>
						<Check className='h-4 w-4 mr-1' />
						Confirmar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
