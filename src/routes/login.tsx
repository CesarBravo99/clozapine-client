import { createFileRoute } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '@/modules/login/lang';
import { PatientForm } from '@/modules/login/components/PatientForm';
import { User, UserCog, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserForm } from '@/modules/login/components/UserForm';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoginDialogProvider } from '@/modules/login/providers/LoginDialogProvider';
import { useLoginDialogContext } from '@/modules/login/contexts/LoginDialogContext';
import {
	AddPatientDialog,
	AddUserDialog,
	AffiliationChangeDialog,
	ForgotPasswordDialog,
} from '@/modules/login/dialogs';

export const Route = createFileRoute('/login')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<LoginDialogProvider>
			<LoginPage />
			<LoginDialogs />
		</LoginDialogProvider>
	);
}

function LoginPage() {
	const lang = useSelector(selectLang);
	const [userType, setUserType] = useState('patient');
	const {
		setAddPatientOpen,
		setAffiliationOpen,
		setForgotPasswordOpen,
		setAddUserOpen,
	} = useLoginDialogContext();
	const patientLinks = langs[lang].userForm.links.patient;
	const personalLinks = langs[lang].userForm.links.personal;

	return (
		<main
			className='container mx-auto max-w-xl 
            flex flex-col justify-center py-[12vh]'
		>
			<div
				className='rounded-2xl shadow-xl 
                    bg-white dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700'
			>
				<div className='p-6'>
					<h2
						className='text-3xl font-bold text-center mb-6 
                            text-gray-800 dark:text-white'
					>
						{langs[lang].userForm.title}
					</h2>

					<div className='space-y-6'>
						{/* <RadioGroup
							value={userType}
							onValueChange={(value) => {
								setUserType(value);
							}}
							className='grid grid-cols-2 gap-4'
						>
							<div>
								<RadioGroupItem value='patient' id='patient' className='peer sr-only' />
								<Label
									htmlFor='patient'
									className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
								>
									<User className='mb-3 h-6 w-6' />
									{langs[lang].login.patientLabel}
								</Label>
							</div>
							<div>
								<RadioGroupItem value='user' id='user' className='peer sr-only' />
								<Label
									htmlFor='user'
									className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
								>
									<UserCog className='mb-3 h-6 w-6' />
									{langs[lang].login.userLabel}
								</Label>
							</div>
                        </RadioGroup> */}

						<Tabs
							defaultValue='patient'
							className='w-full'
							onValueChange={(value) => setUserType(value as 'patient' | 'personal')}
						>
							<TabsList
								className='grid w-full grid-cols-2 rounded-lg mb-5 
                                    pb-11
                                    bg-gray-100 dark:bg-gray-800 '
							>
								<TabsTrigger
									value='patient'
									className='rounded-md py-2 text-md
                                    data-[state=active]:bg-blue-500 
                                    dark:data-[state=active]:bg-blue-500 
                                    data-[state=active]:text-white 
                                    data-[state=active]:shadow-sm'
								>
									<User className='mr-2' />
									{langs[lang].userForm.patientLabel}
								</TabsTrigger>
								<TabsTrigger
									value='personal'
									className='rounded-md text-md
                                data-[state=active]:bg-cyan-500 
                                dark:data-[state=active]:bg-cyan-500
                                data-[state=active]:text-white 
                                data-[state=active]:shadow-sm'
								>
									<UserCog className='mr-2' />
									{langs[lang].userForm.userLabel}
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{userType === 'patient' ? (
							<>
								<PatientForm />
								<div className='flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-sm'>
									<Button
										type='button'
										variant='link'
										className='p-0 h-auto font-normal text-sm text-blue-600 dark:text-blue-400'
										onClick={() => setAddPatientOpen(true)}
									>
										{patientLinks.register}
									</Button>
									<Button
										type='button'
										variant='link'
										className='p-0 h-auto font-normal text-sm text-blue-600 dark:text-blue-400'
										onClick={() => setAffiliationOpen(true)}
									>
										{patientLinks.changeHospital}
									</Button>
								</div>
							</>
						) : (
							<>
								<UserForm />
								<div className='flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-sm'>
									<Button
										type='button'
										variant='link'
										className='p-0 h-auto font-normal text-sm text-cyan-600 dark:text-cyan-400'
										onClick={() => setForgotPasswordOpen(true)}
									>
										{personalLinks.forgotPassword}
									</Button>
									<Button
										type='button'
										variant='link'
										className='p-0 h-auto font-normal text-sm text-cyan-600 dark:text-cyan-400'
										onClick={() => setAddUserOpen(true)}
									>
										{personalLinks.register}
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			{userType === 'patient' && (
				<Alert className='mt-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'>
					<AlertTriangle className='h-4 w-4' />
					<AlertDescription>
						Se recomienda llenar el formulario con asistencia de una persona de
						confianza que esté comprometida con su salud.
					</AlertDescription>
				</Alert>
			)}
		</main>
	);
}

function LoginDialogs() {
	return (
		<>
			<AddPatientDialog />
			<AffiliationChangeDialog />
			<ForgotPasswordDialog />
			<AddUserDialog />
		</>
	);
}
