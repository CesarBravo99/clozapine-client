import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { KeyRound, PencilLine, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { useConfigContext } from '@/modules/config/contexts';
import { langs } from '@/modules/config/lang';

const STATUS_COLOR_MAP: Record<string, string> = {
	active: 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400',
	inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
	pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400',
};

const getInitials = (name: string) => {
	const parts = name.trim().split(' ');
	if (parts.length === 1) {
		return parts[0].slice(0, 2).toUpperCase();
	}
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export function PersonnelList() {
	const lang = useSelector(selectLang);
	const text = langs[lang].components.personnelList;
	const {
		filteredPersonnel,
		setSelectedPersonnel,
		setEditPersonnelDialogOpen,
		setDeletePersonnelDialogOpen,
		setResetPasswordDialogOpen,
	} = useConfigContext();

	if (filteredPersonnel.length === 0) {
		return (
			<div className='text-center py-12 px-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg'>
				<p className='text-gray-500 dark:text-gray-400'>{text.empty}</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{filteredPersonnel.map((person) => (
				<div
					key={person.id}
					className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'
				>
					<div className='p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center'>
						<div className='flex items-center gap-3'>
							<Avatar className='h-10 w-10'>
								<AvatarFallback className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
									{getInitials(person.name)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className='font-medium text-gray-900 dark:text-gray-100'>{person.name}</h3>
								<p className='text-sm text-gray-500 dark:text-gray-400'>{person.role}</p>
							</div>
						</div>
						<span
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								STATUS_COLOR_MAP[person.status] ?? STATUS_COLOR_MAP.inactive
							}`}
						>
							{text.status[person.status] ?? person.status}
						</span>
					</div>
					<div className='p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								<span className='font-medium text-gray-700 dark:text-gray-300'>{text.emailLabel}:</span>{' '}
								{person.email}
							</p>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								<span className='font-medium text-gray-700 dark:text-gray-300'>{text.rutLabel}:</span>{' '}
								{person.rut}
							</p>
						</div>
						<div className='flex flex-wrap gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									setSelectedPersonnel(person);
									setResetPasswordDialogOpen(true);
								}}
								className='border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20'
							>
								<KeyRound className='h-3.5 w-3.5 mr-1' />
								{text.reset}
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									setSelectedPersonnel(person);
									setEditPersonnelDialogOpen(true);
								}}
							>
								<PencilLine className='h-3.5 w-3.5 mr-1' />
								{text.edit}
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									setSelectedPersonnel(person);
									setDeletePersonnelDialogOpen(true);
								}}
								className='border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
							>
								<Trash2 className='h-3.5 w-3.5 mr-1' />
								{text.delete}
							</Button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

