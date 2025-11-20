import { Building, ExternalLink, Mail, MapPin, Phone, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/config/lang';
import { useConfigContext } from '@/modules/config/contexts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export function AffiliationSettings() {
	const lang = useSelector(selectLang);
	const text = langs[lang].components.affiliationSettings;
	const { affiliationSettings, updateAffiliationSettings, persistAffiliationSettings } = useConfigContext();

	return (
		<div className='grid gap-6'>
			<div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
				<div className='bg-gray-50 dark:bg-gray-800 p-4'>
					<h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2'>
						<Building className='h-5 w-5 text-blue-500' />
						{text.infoTitle}
					</h3>
				</div>
				<div className='p-4 space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='hospital-name'>{text.nameLabel}</Label>
						<Input
							id='hospital-name'
							value={affiliationSettings.hospitalName}
							onChange={(event) =>
								updateAffiliationSettings({ hospitalName: event.target.value })
							}
						/>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='contact-email'>{text.emailLabel}</Label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
								<Input
									id='contact-email'
									type='email'
									className='pl-10'
									value={affiliationSettings.contactEmail}
									onChange={(event) =>
										updateAffiliationSettings({ contactEmail: event.target.value })
									}
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='contact-phone'>{text.phoneLabel}</Label>
							<div className='relative'>
								<Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
								<Input
									id='contact-phone'
									className='pl-10'
									value={affiliationSettings.contactPhone}
									onChange={(event) =>
										updateAffiliationSettings({ contactPhone: event.target.value })
									}
								/>
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='address'>{text.addressLabel}</Label>
						<div className='relative'>
							<MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
							<Input
								id='address'
								className='pl-10'
								value={affiliationSettings.address}
								onChange={(event) =>
									updateAffiliationSettings({ address: event.target.value })
								}
							/>
						</div>
					</div>

					<Button
						className='bg-blue-500 hover:bg-blue-600 w-full'
						onClick={persistAffiliationSettings}
					>
						<Save className='mr-2 h-4 w-4' />
						{text.saveInfo}
					</Button>
				</div>
			</div>

			<div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
				<div className='bg-gray-50 dark:bg-gray-800 p-4'>
					<h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2'>
						<ExternalLink className='h-5 w-5 text-blue-500' />
						{text.calendarTitle}
					</h3>
				</div>
				<div className='p-4 space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='space-y-0.5'>
							<Label className='text-base'>{text.allowWeekendLabel}</Label>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								{text.allowWeekendDescription}
							</p>
						</div>
						<Switch
							checked={affiliationSettings.allowWeekendAppointments}
							onCheckedChange={(checked) =>
								updateAffiliationSettings({ allowWeekendAppointments: checked })
							}
						/>
					</div>

					<Button
						className='bg-blue-500 hover:bg-blue-600 w-full'
						onClick={persistAffiliationSettings}
					>
						<Save className='mr-2 h-4 w-4' />
						{text.saveCalendar}
					</Button>
				</div>
			</div>
		</div>
	);
}

