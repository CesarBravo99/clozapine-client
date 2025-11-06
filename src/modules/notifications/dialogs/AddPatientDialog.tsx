// import { useState, useCallback, useEffect } from 'react';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogFooter,
// 	DialogDescription,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { RutInput } from '@/components/RutInput';
// import type { Affiliation } from '@/models/Affiliation/Affiliation';
// import {
// 	PatientGender,
// 	type Patient,
// 	type ClozapineStatus,
// } from '@/models/Patient/Patient';
// import { PatientState, PatientPhase } from '@/models/Patient/ClinicalRecord';
// import { formatRut } from '@/utils/RutValidator';

// interface AddPatientDialogProps {
// 	open: boolean;
// 	onOpenChange: (open: boolean) => void;
// 	onAddPatient: (patient: Patient) => void;
// 	affiliations: Affiliation[];
// }

// const genderOptions = [
// 	{ value: PatientGender.Male.toString(), label: 'Masculino' },
// 	{ value: PatientGender.Female.toString(), label: 'Femenino' },
// 	{ value: PatientGender.Other.toString(), label: 'Otro' },
// ];

// const clozapineStatusOptions: { value: ClozapineStatus; label: string }[] = [
// 	{ value: 'Active', label: 'Activo' },
// 	{ value: 'Suspended', label: 'Suspendido' },
// 	// { value: 'Discontinued', label: 'Discontinuado' },
// ];

// const patientStateOptions = Object.entries(PatientState)
// 	.filter(([key, value]) => typeof value === 'number')
// 	.map(([key, value]) => ({
// 		value: value.toString(),
// 		label: key.replace(/([A-Z])/g, ' $1').trim(),
// 	}));

// const patientPhaseOptions = Object.entries(PatientPhase)
// 	.filter(([key, value]) => typeof value === 'number')
// 	.map(([key, value]) => ({
// 		value: value.toString(),
// 		label: key.replace(/([A-Z])/g, ' $1').trim(),
// 	}));

// export function AddPatientDialog({
// 	open,
// 	onOpenChange,
// 	onAddPatient,
// 	affiliations,
// }: AddPatientDialogProps) {
// 	const [newPatient, setNewPatient] = useState({
// 		patientRut: 0,
// 		patientRutFormatted: '',
// 		patientFirstName: '',
// 		patientLastName: '',
// 		patientEmail: '',
// 		patientPhone: '',
// 		patientGender: PatientGender.Male,
// 		patientBirthday: '',
// 		patientAge: 0,
// 		patientAddress: '',
// 		patientAllergy: [] as string[],
// 		patientHistory: '',
// 		patientNotes: '',
// 		patientAscendants: false,
// 		clozapineUse: false,
// 		clozapineStatus: 'Active' as ClozapineStatus,
// 		clozapineStartDate: '',
// 		clozapineRecords: [],
// 		patientClinicalHistory: {
// 			diagnosis: '',
// 			diagnosisDate: '',
// 			lastHbgValue: undefined,
// 			lastHbgDate: undefined,
// 			lastCheckupOk: undefined,
// 			lastCheckupDate: undefined,
// 			nextCheckupDate: undefined,
// 			patientState: PatientState.Stable,
// 			patientPhase: PatientPhase.InitialStage,
// 		},
// 		patientCurrentMedication: [],
// 		mainAffiliation: {
// 			patientAffiliationId: 0,
// 			userRut: undefined,
// 			userRutFormatted: undefined,
// 			affiliationId: 0,
// 			affiliationName: '',
// 			affiliationDate: new Date().toISOString(),
// 			affiliationStatus: 'Active' as 'Active' | 'Inactive' | 'Transferred',
// 		},
// 		affiliationHistory: [],
// 	});

// 	useEffect(() => {
// 		setNewPatient((prev) => ({
// 			...prev,
// 			patientAge: calculateAge(prev.patientBirthday),
// 		}));
// 	}, [newPatient.patientBirthday]);

// 	const handleInputChange = useCallback(
// 		(
// 			e: React.ChangeEvent<
// 				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// 			>
// 		) => {
// 			const { name, value, type } = e.target;
// 			const isCheckbox = type === 'checkbox';
// 			const checked = (e.target as HTMLInputElement).checked;

// 			if (name.startsWith('patientClinicalHistory.')) {
// 				const field = name.split('.')[1];
// 				setNewPatient((prev) => ({
// 					...prev,
// 					patientClinicalHistory: {
// 						...prev.patientClinicalHistory,
// 						[field]: type === 'number' ? Number(value) || undefined : value,
// 					},
// 				}));
// 			} else if (name.startsWith('mainAffiliation.')) {
// 				const field = name.split('.')[1];
// 				if (field === 'affiliationId') {
// 					const selectedAffiliation = affiliations.find(
// 						(aff) => aff.affiliationId === Number(value)
// 					);
// 					setNewPatient((prev) => ({
// 						...prev,
// 						mainAffiliation: {
// 							...prev.mainAffiliation,
// 							affiliationId: Number(value),
// 							affiliationName: selectedAffiliation?.affiliationName || '',
// 						},
// 					}));
// 				} else {
// 					setNewPatient((prev) => ({
// 						...prev,
// 						mainAffiliation: {
// 							...prev.mainAffiliation,
// 							[field]: value,
// 						},
// 					}));
// 				}
// 			} else {
// 				setNewPatient((prev) => ({
// 					...prev,
// 					[name]: isCheckbox ? checked : value,
// 				}));
// 			}
// 		},
// 		[affiliations]
// 	);

// 	const handleRutChange = useCallback(
// 		(value: string, formatted: string, isValid: boolean) => {
// 			setNewPatient((prev) => ({
// 				...prev,
// 				patientRut: Number(value.replace(/\D/g, '')) || 0,
// 				patientRutFormatted: formatted,
// 			}));
// 		},
// 		[]
// 	);

// 	const handleSelectChange = useCallback(
// 		(name: string, value: string) => {
// 			if (name.startsWith('patientClinicalHistory.')) {
// 				const field = name.split('.')[1];
// 				let processedValue: string | number | undefined = value;
// 				if (field === 'patientState')
// 					processedValue = Number(value) as PatientState;
// 				if (field === 'patientPhase')
// 					processedValue = Number(value) as PatientPhase;

// 				setNewPatient((prev) => ({
// 					...prev,
// 					patientClinicalHistory: {
// 						...prev.patientClinicalHistory,
// 						[field]: processedValue,
// 					},
// 				}));
// 			} else if (name === 'mainAffiliation.affiliationId') {
// 				const selectedAffiliation = affiliations.find(
// 					(aff) => aff.affiliationId === Number(value)
// 				);
// 				setNewPatient((prev) => ({
// 					...prev,
// 					mainAffiliation: {
// 						...prev.mainAffiliation,
// 						affiliationId: Number(value),
// 						affiliationName: selectedAffiliation?.affiliationName || '',
// 					},
// 				}));
// 			} else if (name === 'patientGender') {
// 				setNewPatient((prev) => ({
// 					...prev,
// 					patientGender: Number(value) as PatientGender,
// 				}));
// 			} else if (name === 'clozapineStatus') {
// 				setNewPatient((prev) => ({
// 					...prev,
// 					clozapineStatus: value as ClozapineStatus,
// 				}));
// 			} else {
// 				setNewPatient((prev) => ({
// 					...prev,
// 					[name]: value,
// 				}));
// 			}
// 		},
// 		[affiliations]
// 	);

// 	const handleSubmit = useCallback(() => {
// 		// Basic validation (add more as needed)
// 		if (
// 			!newPatient.patientRut ||
// 			!newPatient.patientFirstName ||
// 			!newPatient.patientLastName ||
// 			!newPatient.patientBirthday ||
// 			!newPatient.mainAffiliation.affiliationId
// 		) {
// 			alert('Por favor complete todos los campos obligatorios.');
// 			return;
// 		}

// 		// Find the selected affiliation to get its location
// 		const selectedAffiliation = affiliations.find(
// 			(aff) => aff.affiliationId === newPatient.mainAffiliation.affiliationId
// 		);

// 		// Define a default location in case the selected one isn't found (shouldn't happen with validation)
// 		const defaultLocation = { address: '', city: '', region: '', postalCode: '' };

// 		// Construct the final patient object with correct types
// 		const patientToAdd: Patient = {
// 			patientRut: newPatient.patientRut,
// 			patientRutFormatted: formatRut(newPatient.patientRut.toString()),
// 			patientFirstName: newPatient.patientFirstName,
// 			patientLastName: newPatient.patientLastName,
// 			patientEmail: newPatient.patientEmail,
// 			patientPhone: newPatient.patientPhone,
// 			patientGender: Number(newPatient.patientGender) as PatientGender,
// 			patientBirthday: newPatient.patientBirthday,
// 			patientAge: calculateAge(newPatient.patientBirthday),
// 			patientAddress: newPatient.patientAddress,
// 			patientAllergy: newPatient.patientAllergy,
// 			patientHistory: newPatient.patientHistory,
// 			patientNotes: newPatient.patientNotes ? [newPatient.patientNotes] : [],
// 			patientAscendants: newPatient.patientAscendants,
// 			clozapineUse: newPatient.clozapineUse,
// 			clozapineStatus: newPatient.clozapineStatus,
// 			clozapineStartDate: newPatient.clozapineStartDate || undefined,
// 			clozapineRecords: newPatient.clozapineRecords || [],
// 			patientClinicalHistory: {
// 				diagnosis: newPatient.patientClinicalHistory.diagnosis || '',
// 				diagnosisDate: newPatient.patientClinicalHistory.diagnosisDate || '',
// 				lastHbgValue: newPatient.patientClinicalHistory.lastHbgValue ?? 0,
// 				lastHbgDate: newPatient.patientClinicalHistory.lastHbgDate || '',
// 				lastCheckupOk: newPatient.patientClinicalHistory.lastCheckupOk ?? false,
// 				lastCheckupDate: newPatient.patientClinicalHistory.lastCheckupDate || '',
// 				nextCheckupDate: newPatient.patientClinicalHistory.nextCheckupDate || '',
// 				patientState: Number(
// 					newPatient.patientClinicalHistory.patientState
// 				) as PatientState,
// 				patientPhase: Number(
// 					newPatient.patientClinicalHistory.patientPhase
// 				) as PatientPhase,
// 			},
// 			patientCurrentMedication: newPatient.patientCurrentMedication || [],
// 			mainAffiliation: {
// 				patientAffiliationId:
// 					newPatient.mainAffiliation.patientAffiliationId || 0,
// 				userRut: newPatient.mainAffiliation.userRut || 0,
// 				userRutFormatted: newPatient.mainAffiliation.userRutFormatted || '',
// 				affiliationId: Number(newPatient.mainAffiliation.affiliationId) || 0,
// 				affiliationName: selectedAffiliation?.affiliationName || '',
// 				affiliationDate:
// 					newPatient.mainAffiliation.affiliationDate ||
// 					new Date().toISOString(),
// 				affiliationStatus: newPatient.mainAffiliation.affiliationStatus as any,
// 				affiliationLocation:
// 					selectedAffiliation?.affiliationLocation || defaultLocation,
// 			},
// 			affiliationHistory: newPatient.affiliationHistory || [],
// 			caretaker: {
// 				caretakerName: '',
// 				caretakerPhone: '',
// 				caretakerRelationship: '',
// 			},
// 		};

// 		onAddPatient(patientToAdd);
// 		onOpenChange(false);
// 	}, [newPatient, onAddPatient, onOpenChange, affiliations]);

// 	return (
// 		<Dialog open={open} onOpenChange={onOpenChange}>
// 			<DialogContent className='max-w-3xl dark:bg-gray-900'>
// 				<DialogHeader>
// 					<DialogTitle>Agregar Nuevo Paciente</DialogTitle>
// 					<DialogDescription>
// 						Complete la información del paciente a continuación.
// 					</DialogDescription>
// 				</DialogHeader>
// 				<div className='grid md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2'>
// 					<div className='space-y-4'>
// 						<h3 className='text-lg font-semibold border-b pb-2 dark:border-gray-700'>
// 							Información Personal
// 						</h3>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientRut'>RUT</Label>
// 							<RutInput
// 								value={newPatient.patientRutFormatted}
// 								onChange={(value) => handleRutChange(value, '', true)}
// 							/>
// 						</div>
// 						<div className='grid grid-cols-2 gap-4'>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientFirstName'>Nombres</Label>
// 								<Input
// 									id='patientFirstName'
// 									name='patientFirstName'
// 									value={newPatient.patientFirstName}
// 									onChange={handleInputChange}
// 									placeholder='Juan Andrés'
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 									required
// 								/>
// 							</div>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientLastName'>Apellidos</Label>
// 								<Input
// 									id='patientLastName'
// 									name='patientLastName'
// 									value={newPatient.patientLastName}
// 									onChange={handleInputChange}
// 									placeholder='Pérez González'
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 									required
// 								/>
// 							</div>
// 						</div>
// 						<div className='grid grid-cols-2 gap-4'>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientGender'>Género</Label>
// 								<Select
// 									name='patientGender'
// 									value={String(newPatient.patientGender)}
// 									onValueChange={(value) =>
// 										handleSelectChange('patientGender', value)
// 									}
// 								>
// 									<SelectTrigger
// 										id='patientGender'
// 										className='dark:border-gray-700 dark:bg-gray-800'
// 									>
// 										<SelectValue placeholder='Seleccionar género' />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{genderOptions.map((option) => (
// 											<SelectItem
// 												key={option.value}
// 												value={option.value}
// 											>
// 												{option.label}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientBirthday'>Fecha Nacimiento</Label>
// 								<Input
// 									id='patientBirthday'
// 									name='patientBirthday'
// 									type='date'
// 									value={newPatient.patientBirthday}
// 									onChange={handleInputChange}
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 								/>
// 								{newPatient.patientAge > 0 && (
// 									<span className='text-xs text-gray-500 dark:text-gray-400'>
// 										Edad: {newPatient.patientAge} años
// 									</span>
// 								)}
// 							</div>
// 						</div>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientAddress'>Dirección</Label>
// 							<Input
// 								id='patientAddress'
// 								name='patientAddress'
// 								value={newPatient.patientAddress}
// 								onChange={handleInputChange}
// 								placeholder='Av. Siempre Viva 123, Comuna'
// 								className='dark:border-gray-700 dark:bg-gray-800'
// 							/>
// 						</div>
// 						<div className='grid grid-cols-2 gap-4'>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientEmail'>Email</Label>
// 								<Input
// 									id='patientEmail'
// 									name='patientEmail'
// 									type='email'
// 									value={newPatient.patientEmail}
// 									onChange={handleInputChange}
// 									placeholder='juan.perez@email.com'
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 								/>
// 							</div>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientPhone'>Teléfono</Label>
// 								<Input
// 									id='patientPhone'
// 									name='patientPhone'
// 									value={newPatient.patientPhone}
// 									onChange={handleInputChange}
// 									placeholder='+56 9 1234 5678'
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 								/>
// 							</div>
// 						</div>
// 						<div className='space-y-2'>
// 							<Label htmlFor='mainAffiliation.affiliationId'>
// 								Centro Médico Principal
// 							</Label>
// 							<Select
// 								name='mainAffiliation.affiliationId'
// 								value={String(
// 									newPatient.mainAffiliation.affiliationId || ''
// 								)}
// 								onValueChange={(value) =>
// 									handleSelectChange(
// 										'mainAffiliation.affiliationId',
// 										value
// 									)
// 								}
// 								required
// 							>
// 								<SelectTrigger
// 									id='affiliationId'
// 									className='dark:border-gray-700 dark:bg-gray-800'
// 								>
// 									<SelectValue placeholder='Seleccionar centro médico' />
// 								</SelectTrigger>
// 								<SelectContent>
// 									{affiliations.map((aff) => (
// 										<SelectItem
// 											key={aff.affiliationId}
// 											value={String(aff.affiliationId)}
// 										>
// 											{aff.affiliationName}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 						</div>
// 					</div>

// 					<div className='space-y-4'>
// 						<h3 className='text-lg font-semibold border-b pb-2 dark:border-gray-700'>
// 							Información Médica
// 						</h3>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientClinicalHistory.diagnosis'>
// 								Diagnóstico Principal
// 							</Label>
// 							<Input
// 								id='diagnosis'
// 								name='patientClinicalHistory.diagnosis'
// 								value={newPatient.patientClinicalHistory.diagnosis}
// 								onChange={handleInputChange}
// 								placeholder='Ej: Esquizofrenia'
// 								className='dark:border-gray-700 dark:bg-gray-800'
// 							/>
// 						</div>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientHistory'>Antecedentes Médicos</Label>
// 							<Textarea
// 								id='patientHistory'
// 								name='patientHistory'
// 								value={newPatient.patientHistory}
// 								onChange={handleInputChange}
// 								placeholder='Comorbilidades, cirugías, etc.'
// 								className='dark:border-gray-700 dark:bg-gray-800 min-h-[80px]'
// 							/>
// 						</div>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientAllergy'>Alergias Conocidas</Label>
// 							<Input
// 								id='patientAllergy'
// 								name='patientAllergy'
// 								value={newPatient.patientAllergy.join(', ')}
// 								onChange={(e) =>
// 									setNewPatient((prev) => ({
// 										...prev,
// 										patientAllergy: e.target.value
// 											.split(',')
// 											.map((s) => s.trim())
// 											.filter(Boolean),
// 									}))
// 								}
// 								placeholder='Penicilina, Aspirina, etc. (separadas por coma)'
// 								className='dark:border-gray-700 dark:bg-gray-800'
// 							/>
// 						</div>
// 						<div className='flex items-center space-x-2'>
// 							<Input
// 								type='checkbox'
// 								id='clozapineUse'
// 								name='clozapineUse'
// 								checked={newPatient.clozapineUse}
// 								onChange={handleInputChange}
// 								className='h-4 w-4 dark:border-gray-600 dark:bg-gray-800'
// 							/>
// 							<Label htmlFor='clozapineUse' className='text-sm font-medium'>
// 								¿Usa Clozapina?
// 							</Label>
// 						</div>
// 						{newPatient.clozapineUse && (
// 							<div className='grid grid-cols-2 gap-4 pl-6'>
// 								<div className='space-y-2'>
// 									<Label htmlFor='clozapineStatus'>
// 										Estado Clozapina
// 									</Label>
// 									<Select
// 										name='clozapineStatus'
// 										value={newPatient.clozapineStatus}
// 										onValueChange={(value) =>
// 											handleSelectChange('clozapineStatus', value)
// 										}
// 									>
// 										<SelectTrigger
// 											id='clozapineStatus'
// 											className='dark:border-gray-700 dark:bg-gray-800'
// 										>
// 											<SelectValue placeholder='Estado' />
// 										</SelectTrigger>
// 										<SelectContent>
// 											{clozapineStatusOptions.map((option) => (
// 												<SelectItem
// 													key={option.value}
// 													value={option.value}
// 												>
// 													{option.label}
// 												</SelectItem>
// 											))}
// 										</SelectContent>
// 									</Select>
// 								</div>
// 								<div className='space-y-2'>
// 									<Label htmlFor='clozapineStartDate'>
// 										Fecha Inicio Clozapina
// 									</Label>
// 									<Input
// 										id='clozapineStartDate'
// 										name='clozapineStartDate'
// 										type='date'
// 										value={newPatient.clozapineStartDate}
// 										onChange={handleInputChange}
// 										className='dark:border-gray-700 dark:bg-gray-800'
// 									/>
// 								</div>
// 							</div>
// 						)}
// 						<div className='grid grid-cols-2 gap-4'>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientState'>Estado Paciente</Label>
// 								<Select
// 									name='patientClinicalHistory.patientState'
// 									value={String(
// 										newPatient.patientClinicalHistory.patientState
// 									)}
// 									onValueChange={(value) =>
// 										handleSelectChange(
// 											'patientClinicalHistory.patientState',
// 											value
// 										)
// 									}
// 								>
// 									<SelectTrigger
// 										id='patientState'
// 										className='dark:border-gray-700 dark:bg-gray-800'
// 									>
// 										<SelectValue placeholder='Seleccionar estado' />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{patientStateOptions.map((option) => (
// 											<SelectItem
// 												key={option.value}
// 												value={option.value}
// 											>
// 												{option.label}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 							<div className='space-y-2'>
// 								<Label htmlFor='patientPhase'>Fase Tratamiento</Label>
// 								<Select
// 									name='patientClinicalHistory.patientPhase'
// 									value={String(
// 										newPatient.patientClinicalHistory.patientPhase
// 									)}
// 									onValueChange={(value) =>
// 										handleSelectChange(
// 											'patientClinicalHistory.patientPhase',
// 											value
// 										)
// 									}
// 								>
// 									<SelectTrigger
// 										id='patientPhase'
// 										className='dark:border-gray-700 dark:bg-gray-800'
// 									>
// 										<SelectValue placeholder='Seleccionar fase' />
// 									</SelectTrigger>
// 									<SelectContent>
// 										{patientPhaseOptions.map((option) => (
// 											<SelectItem
// 												key={option.value}
// 												value={option.value}
// 											>
// 												{option.label}
// 											</SelectItem>
// 										))}
// 									</SelectContent>
// 								</Select>
// 							</div>
// 						</div>
// 						<div className='space-y-2'>
// 							<Label htmlFor='patientNotes'>Notas Adicionales</Label>
// 							<Textarea
// 								id='patientNotes'
// 								name='patientNotes'
// 								value={newPatient.patientNotes}
// 								onChange={handleInputChange}
// 								placeholder='Notas generales sobre el paciente...'
// 								className='dark:border-gray-700 dark:bg-gray-800 min-h-[80px]'
// 							/>
// 						</div>
// 					</div>
// 				</div>

// 				<DialogFooter>
// 					<Button variant='outline' onClick={() => onOpenChange(false)}>
// 						Cancelar
// 					</Button>
// 					<Button
// 						onClick={handleSubmit}
// 						disabled={
// 							!newPatient.patientRutFormatted ||
// 							!newPatient.patientFirstName ||
// 							!newPatient.patientLastName ||
// 							!newPatient.mainAffiliation.affiliationId
// 						}
// 						className='bg-blue-500 hover:bg-blue-600'
// 					>
// 						Guardar Paciente
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }

// function calculateAge(birthday: string): number {
// 	if (!birthday) return 0;
// 	try {
// 		const birthDate = new Date(birthday);
// 		const today = new Date();
// 		let age = today.getFullYear() - birthDate.getFullYear();
// 		const m = today.getMonth() - birthDate.getMonth();
// 		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
// 			age--;
// 		}
// 		return age > 0 ? age : 0;
// 	} catch (e) {
// 		console.error('Error calculating age:', e);
// 		return 0;
// 	}
// }
