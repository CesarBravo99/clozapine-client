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

export function ResetPasswordDialog() {
	const lang = useSelector(selectLang);
	const text = langs[lang].dialogs.resetPassword;
	const {
		isResetPasswordDialogOpen,
		setResetPasswordDialogOpen,
		selectedPersonnel,
		handleResetPassword,
	} = useConfigContext();

	return (
		<Dialog open={isResetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
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
					<Button variant='outline' onClick={() => setResetPasswordDialogOpen(false)}>
						{text.cancel}
					</Button>
					<Button onClick={handleResetPassword} disabled={!selectedPersonnel}>
						{text.confirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

