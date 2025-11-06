import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { selectUser } from '@/redux/user/user.slice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
	selectSelectedAffiliationId,
	setSelectedAffiliationId,
} from '@/redux/session/session.slice';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function SelectAffiliationDialog({ open, onOpenChange }: Props) {
	const user = useSelector(selectUser);
	const selectedAffiliationId = useSelector(selectSelectedAffiliationId);
	const dispatch = useDispatch();

	useEffect(() => {
		if (open) {
			dispatch(setSelectedAffiliationId(selectedAffiliationId));
		}
	}, [selectedAffiliationId, open]);

	const handleAffiliationSelect = (value: string) => {
		dispatch(setSelectedAffiliationId(Number(value)));
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Seleccionar afiliación</DialogTitle>
					<DialogDescription>Selecciona una afiliación para continuar</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-4'>
					<div className='flex flex-col gap-2'>
						<h3 className='text-lg font-medium'>Afiliaciones</h3>
						<RadioGroup
							value={selectedAffiliationId?.toString() ?? ''}
							onValueChange={handleAffiliationSelect}
							className='space-y-4'
						>
							{Object.values(user?.userAffiliations ?? {}).map((affiliation) => (
								<div
									key={affiliation.affiliationId}
									className={`flex items-center space-x-4 rounded-lg border p-4 transition-all cursor-pointer ${
										selectedAffiliationId === affiliation.affiliationId
											? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30'
											: 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
									}`}
								>
									<RadioGroupItem
										value={affiliation.affiliationId.toString()}
										id={affiliation.affiliationId.toString()}
										className='sr-only'
									/>
									<Label
										htmlFor={affiliation.affiliationId.toString()}
										className='flex flex-1 cursor-pointer items-center justify-between'
									>
										<div className='text-base font-medium text-gray-900 dark:text-gray-100'>
											{affiliation.affiliationName}
										</div>
										{selectedAffiliationId === affiliation.affiliationId && (
											<div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white'>
												<Check className='h-3.5 w-3.5' />
											</div>
										)}
									</Label>
								</div>
							))}
						</RadioGroup>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
