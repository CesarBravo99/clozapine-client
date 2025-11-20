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
import { langs } from '@/modules/config/lang';
import { useConfigContext } from '@/modules/config/contexts';

export function DeletePersonnelDialog() {
	const lang = useSelector(selectLang);
	const text = langs[lang].dialogs.deletePersonnel;
	const {
		isDeletePersonnelDialogOpen,
		setDeletePersonnelDialogOpen,
		selectedPersonnel,
		handleDeletePersonnel,
	} = useConfigContext();

	return (
		<Dialog open={isDeletePersonnelDialogOpen} onOpenChange={setDeletePersonnelDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{text.title}</DialogTitle>
					<DialogDescription>{text.description}</DialogDescription>
				</DialogHeader>
				<div>
					<p className='text-sm text-gray-600 dark:text-gray-300'>
						<strong>{selectedPersonnel?.name}</strong>
					</p>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => setDeletePersonnelDialogOpen(false)}>
						{text.cancel}
					</Button>
					<Button
						variant='destructive'
						onClick={handleDeletePersonnel}
						disabled={!selectedPersonnel}
					>
						{text.confirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

