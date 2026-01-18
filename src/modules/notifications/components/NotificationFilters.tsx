import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
// import { RutInput } from '@/components/RutInput';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/notifications/lang';

export interface NotificationFiltersProps {
	selectedDate: string;
	setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
	selectedType: string;
	setSelectedType: React.Dispatch<React.SetStateAction<string>>;
	showPendingOnly: boolean;
	setShowPendingOnly: React.Dispatch<React.SetStateAction<boolean>>;
	filterByRut: boolean;
	setFilterByRut: React.Dispatch<React.SetStateAction<boolean>>;
	resetFilters: () => void;
}

export function NotificationFilters({
	selectedDate,
	setSelectedDate,
	selectedType,
	setSelectedType,
	showPendingOnly,
	setShowPendingOnly,
	filterByRut,
	setFilterByRut,
	resetFilters,
}: NotificationFiltersProps) {
	const [showFilters, setShowFilters] = useState(false);
	const lang = useSelector(selectLang);

	const onToggleFilters = () => setShowFilters(!showFilters);

	return (
		<div className='mb-4'>
			<Button
				variant='outline'
				onClick={onToggleFilters}
				className='w-full justify-between mb-3'
			>
				<div className='flex items-center'>
					<Filter className='h-4 w-4 mr-2' />
					{langs[lang].components.notificationFilters.filters}
				</div>
				<ChevronDown className={`h-4 w-4 transform ${showFilters ? 'rotate-180' : ''}`} />
			</Button>

			<Collapsible open={showFilters}>
				<CollapsibleContent className='space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='date-filter'>
								{langs[lang].components.notificationFilters.filterByDate}
							</Label>
							<Input
								id='date-filter'
								type='date'
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								className='mt-1'
							/>
						</div>

						<div>
							<Label htmlFor='type-filter'>
								{langs[lang].components.notificationFilters.filterByType}
							</Label>
							<Select value={selectedType} onValueChange={setSelectedType}>
								<SelectTrigger id='type-filter' className='mt-1'>
									<SelectValue
										placeholder={
											langs[lang].components.notificationFilters.selectType
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>
										{langs[lang].components.notificationFilters.allTypes}
									</SelectItem>
									<SelectItem value='urgente'>
										{langs[lang].components.notificationFilters.urgent}
									</SelectItem>
									<SelectItem value='importante'>
										{langs[lang].components.notificationFilters.important}
									</SelectItem>
									<SelectItem value='informativo'>
										{langs[lang].components.notificationFilters.informative}
									</SelectItem>
									<SelectItem value='recordatorio'>
										{langs[lang].components.notificationFilters.reminder}
									</SelectItem>
									<SelectItem value='solicitud'>
										{langs[lang].components.notificationFilters.request}
									</SelectItem>
									<SelectItem value='control'>
										{langs[lang].components.notificationFilters.control}
									</SelectItem>
									<SelectItem value='sugerencia'>
										{langs[lang].components.notificationFilters.suggestion}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='flex items-center space-x-2'>
							<Switch
								id='pending-filter'
								checked={showPendingOnly}
								onCheckedChange={setShowPendingOnly}
							/>
							<Label htmlFor='pending-filter'>
								{langs[lang].components.notificationFilters.showPendingOnly}
							</Label>
						</div>

						<div className='flex items-center space-x-2'>
							<Switch
								id='rut-toggle'
								checked={filterByRut}
								onCheckedChange={setFilterByRut}
							/>
							<Label htmlFor='rut-toggle'>
								{langs[lang].components.notificationFilters.filterByRut}
							</Label>
						</div>
					</div>

					{filterByRut && (
						<div>
							{/* <RutInput
								value={rutFilter}
								onChange={(value) => setRutFilter(value)}
							/> */}
						</div>
					)}

					<Button variant='outline' onClick={resetFilters} className='w-full'>
						<X className='h-4 w-4 mr-2' />
						{langs[lang].components.notificationFilters.clearFilters}
					</Button>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
