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
import { Check, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import type { Notification } from '@/domain/notification.types';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';

interface CompleteTaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	notification: Notification;
	onCompleteTask: (id: string, notes?: string) => Promise<void>;
}

export function CompleteTaskDialog({
	open,
	onOpenChange,
	notification,
	onCompleteTask,
}: CompleteTaskDialogProps) {
	const [notes, setNotes] = useState('');
	const lang = useSelector(selectLang);
	const dictionary = langs[lang].dialogs.completeTask;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleClose = (value: boolean) => {
		if (!value) {
			setNotes('');
			setError(null);
		}
		onOpenChange(value);
	};

	const handleComplete = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			await onCompleteTask(notification.notificationId, notes);
			setNotes('');
			onOpenChange(false);
		} catch (err) {
			console.error('❌ Failed to complete notification:', err);
			setError(dictionary.error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Check className='h-5 w-5 text-green-500' />
						{dictionary.title}
					</DialogTitle>
					<DialogDescription>{dictionary.description}</DialogDescription>
				</DialogHeader>

				<div className='py-4'>
					<div className='rounded-md bg-amber-50 p-4 text-amber-800 mb-4'>
						<p className='text-sm font-medium'>
							{notification.title || dictionary.defaultNotificationTitle}
						</p>
						<p className='text-sm mt-1'>
							{notification.content ||
								langs[lang].components.notificationListItem.noDetails}
						</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='notes'>{dictionary.notesLabel}</Label>
						<Textarea
							id='notes'
							placeholder={dictionary.notesPlaceholder}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className='min-h-[100px]'
						/>
					</div>
					{error && (
						<p className='mt-2 text-sm text-red-500 dark:text-red-400'>
							{error}
						</p>
					)}
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => handleClose(false)} disabled={isSubmitting}>
						<X className='h-4 w-4 mr-1' />
						{dictionary.cancel}
					</Button>
					<Button
						disabled={isSubmitting}
						onClick={handleComplete}
						className='bg-green-600 hover:bg-green-700'
					>
						{isSubmitting ? (
							<Loader2 className='h-4 w-4 mr-2 animate-spin' />
						) : (
							<Check className='h-4 w-4 mr-1' />
						)}
						{isSubmitting ? dictionary.saving : dictionary.confirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
