// import { useState } from 'react';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
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
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { RutInput } from '@/components/RutInput';
// import { User, Phone, Plus } from 'lucide-react';
// import { initialPatients } from '@/services/test/Patients';
// import type { Patient } from '@/models/Patient/Patient';

// interface AddAppointmentDialogProps {
// 	open: boolean;
// 	onOpenChange: (open: boolean) => void;
// 	patient: Patient | null;
// 	onAddEvent: (eventData: any) => void;
// }

// export function AddAppointmentDialog({
// 	open,
// 	onOpenChange,
// 	patient,
// 	onAddEvent,
// }: AddAppointmentDialogProps) {
// 	// States for new event details
// 	const [newEvent, setNewEvent] = useState({
// 		rut: patient?.patientRut ? String(patient.patientRut) : '',
// 		patientName: patient
// 			? `${patient.patientFirstName} ${patient.patientLastName}`
// 			: '',
// 		patientPhone: patient?.patientPhone || '',
// 		date: '',
// 		time: '',
// 		duration: '30',
// 		type: 'patient_control',
// 		notes: '',
// 	});

// 	// States for patient search
// 	const [searchType, setSearchType] = useState<'rut' | 'nombre'>('rut');
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [searchResults, setSearchResults] = useState<typeof initialPatients>([]);
// 	const [showSearchResults, setShowSearchResults] = useState(false);

// 	// Time slots generation
// 	const getTimeSlots = () => {
// 		const slots = [];
// 		for (let hour = 8; hour < 18; hour++) {
// 			for (let minute = 0; minute < 60; minute += 30) {
// 				slots.push(
// 					`${hour.toString().padStart(2, '0')}:${minute
// 						.toString()
// 						.padStart(2, '0')}`
// 				);
// 			}
// 		}
// 		return slots;
// 	};

// 	// Handle adding the event
// 	const handleAddEvent = () => {
// 		if (!newEvent.rut || !newEvent.date || !newEvent.time) {
// 			alert('Por favor complete todos los campos requeridos.');
// 			return;
// 		}

// 		// Get patient from RUT
// 		const rutNumber = parseInt(newEvent.rut.replace(/\D/g, ''), 10);
// 		const patient = initialPatients.find((p) => p.patientRut === rutNumber);

// 		if (!patient) {
// 			alert('Paciente no encontrado. Por favor, verifique el RUT.');
// 			return;
// 		}

// 		// Create timestamps
// 		const [hours, minutes] = newEvent.time.split(':').map(Number);
// 		const startDate = new Date(newEvent.date);
// 		startDate.setHours(hours, minutes, 0, 0);

// 		const endDate = new Date(startDate);
// 		endDate.setMinutes(endDate.getMinutes() + Number.parseInt(newEvent.duration));

// 		// Create event object
// 		const eventData = {
// 			patientRut: patient.patientRut,
// 			patientName: `${patient.patientFirstName} ${patient.patientLastName}`,
// 			patientPhone: patient.patientPhone,
// 			title: `Cita con ${patient.patientFirstName} ${patient.patientLastName}`,
// 			date: startDate.toISOString(),
// 			duration: Number.parseInt(newEvent.duration),
// 			start: startDate.toISOString(),
// 			end: endDate.toISOString(),
// 			type: newEvent.type,
// 			status: 'pending',
// 			notes: newEvent.notes,
// 		};

// 		onAddEvent(eventData);
// 		onOpenChange(false);
// 	};

// 	// Handle search for patients
// 	const handleSearch = () => {
// 		if (!searchTerm) return;

// 		let results;
// 		if (searchType === 'rut') {
// 			results = initialPatients.filter((p) =>
// 				p.patientRut.toString().includes(searchTerm.replace(/\D/g, ''))
// 			);
// 		} else {
// 			const term = searchTerm.toLowerCase();
// 			results = initialPatients.filter(
// 				(p) =>
// 					p.patientFirstName.toLowerCase().includes(term) ||
// 					p.patientLastName.toLowerCase().includes(term)
// 			);
// 		}

// 		setSearchResults(results);
// 		setShowSearchResults(true);
// 	};

// 	// Handle selecting a patient from search results
// 	const selectPatient = (patient: Patient) => {
// 		setNewEvent({
// 			...newEvent,
// 			rut: String(patient.patientRut),
// 			patientName: `${patient.patientFirstName} ${patient.patientLastName}`,
// 			patientPhone: patient.patientPhone || '',
// 		});
// 		setShowSearchResults(false);
// 	};

// 	return (
// 		<Dialog open={open} onOpenChange={onOpenChange}>
// 			<DialogContent className='sm:max-w-[500px]'>
// 				<DialogHeader>
// 					<DialogTitle className='text-xl'>Agendar Cita</DialogTitle>
// 					<DialogDescription>
// 						Complete los detalles para agendar una nueva cita.
// 					</DialogDescription>
// 				</DialogHeader>

// 				<div className='space-y-6'>
// 					{/* Patient Selection Section */}
// 					<div className='space-y-4'>
// 						<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
// 							Información del Paciente
// 						</h3>

// 						{!newEvent.rut ? (
// 							<div className='space-y-4'>
// 								<RadioGroup
// 									value={searchType}
// 									onValueChange={(value) =>
// 										setSearchType(value as 'rut' | 'nombre')
// 									}
// 									className='flex space-x-4'
// 								>
// 									<div className='flex items-center space-x-2'>
// 										<RadioGroupItem value='rut' id='rut' />
// 										<Label htmlFor='rut'>Buscar por RUT</Label>
// 									</div>
// 									<div className='flex items-center space-x-2'>
// 										<RadioGroupItem value='nombre' id='nombre' />
// 										<Label htmlFor='nombre'>Buscar por Nombre</Label>
// 									</div>
// 								</RadioGroup>

// 								<div className='flex items-center space-x-2'>
// 									{searchType === 'rut' ? (
// 										<RutInput
// 											value={searchTerm}
// 											onChange={(value) => setSearchTerm(value)}
// 										/>
// 									) : (
// 										<Input
// 											placeholder='Ingrese nombre del paciente'
// 											value={searchTerm}
// 											onChange={(e) =>
// 												setSearchTerm(e.target.value)
// 											}
// 										/>
// 									)}
// 									<Button onClick={handleSearch}>Buscar</Button>
// 								</div>

// 								{showSearchResults && (
// 									<div className='mt-2 border rounded-md max-h-[200px] overflow-y-auto'>
// 										{searchResults.length === 0 ? (
// 											<div className='p-4 text-center text-gray-500'>
// 												No se encontraron pacientes
// 											</div>
// 										) : (
// 											<div className='divide-y'>
// 												{searchResults.map((p) => (
// 													<div
// 														key={p.patientRut}
// 														className='p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between'
// 														onClick={() => selectPatient(p)}
// 													>
// 														<div>
// 															<div className='font-medium'>
// 																{p.patientFirstName}{' '}
// 																{p.patientLastName}
// 															</div>
// 															<div className='text-sm text-gray-500'>
// 																RUT: {p.patientRut}
// 															</div>
// 														</div>
// 														<Button variant='ghost' size='sm'>
// 															<Plus className='h-4 w-4' />
// 														</Button>
// 													</div>
// 												))}
// 											</div>
// 										)}
// 									</div>
// 								)}
// 							</div>
// 						) : (
// 							<div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-md'>
// 								<div className='flex justify-between items-center'>
// 									<div>
// 										<div className='font-medium flex items-center'>
// 											<User className='h-4 w-4 mr-2 text-gray-400' />
// 											{newEvent.patientName}
// 										</div>
// 										<div className='text-sm text-gray-500 mt-1'>
// 											RUT: {newEvent.rut}
// 										</div>
// 										{newEvent.patientPhone && (
// 											<div className='text-sm text-gray-500 flex items-center mt-1'>
// 												<Phone className='h-4 w-4 mr-2 text-gray-400' />
// 												{newEvent.patientPhone}
// 											</div>
// 										)}
// 									</div>
// 									<Button
// 										variant='outline'
// 										size='sm'
// 										onClick={() =>
// 											setNewEvent({
// 												...newEvent,
// 												rut: '',
// 												patientName: '',
// 												patientPhone: '',
// 											})
// 										}
// 									>
// 										Cambiar
// 									</Button>
// 								</div>
// 							</div>
// 						)}
// 					</div>

// 					{/* Appointment Details Section */}
// 					<div className='space-y-4'>
// 						<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
// 							Detalles de la Cita
// 						</h3>

// 						<div className='grid grid-cols-4 items-center gap-4'>
// 							<Label htmlFor='date' className='text-right'>
// 								Fecha
// 							</Label>
// 							<Input
// 								type='date'
// 								id='date'
// 								value={newEvent.date}
// 								onChange={(e) =>
// 									setNewEvent({ ...newEvent, date: e.target.value })
// 								}
// 								className='col-span-3'
// 							/>
// 						</div>

// 						<div className='grid grid-cols-4 items-center gap-4'>
// 							<Label htmlFor='time' className='text-right'>
// 								Hora
// 							</Label>
// 							<Select
// 								value={newEvent.time}
// 								onValueChange={(value) =>
// 									setNewEvent({ ...newEvent, time: value })
// 								}
// 							>
// 								<SelectTrigger id='time' className='col-span-3'>
// 									<SelectValue placeholder='Seleccione hora' />
// 								</SelectTrigger>
// 								<SelectContent>
// 									{getTimeSlots().map((slot) => (
// 										<SelectItem key={slot} value={slot}>
// 											{slot}
// 										</SelectItem>
// 									))}
// 								</SelectContent>
// 							</Select>
// 						</div>

// 						<div className='grid grid-cols-4 items-center gap-4'>
// 							<Label htmlFor='duration' className='text-right'>
// 								Duración
// 							</Label>
// 							<Select
// 								value={newEvent.duration}
// 								onValueChange={(value) =>
// 									setNewEvent({ ...newEvent, duration: value })
// 								}
// 							>
// 								<SelectTrigger id='duration' className='col-span-3'>
// 									<SelectValue placeholder='Seleccione duración' />
// 								</SelectTrigger>
// 								<SelectContent>
// 									<SelectItem value='15'>15 minutos</SelectItem>
// 									<SelectItem value='30'>30 minutos</SelectItem>
// 									<SelectItem value='45'>45 minutos</SelectItem>
// 									<SelectItem value='60'>1 hora</SelectItem>
// 									<SelectItem value='90'>1 hora 30 minutos</SelectItem>
// 									<SelectItem value='120'>2 horas</SelectItem>
// 								</SelectContent>
// 							</Select>
// 						</div>

// 						<div className='grid grid-cols-4 items-center gap-4'>
// 							<Label htmlFor='type' className='text-right'>
// 								Tipo
// 							</Label>
// 							<RadioGroup
// 								value={newEvent.type}
// 								onValueChange={(value) =>
// 									setNewEvent({ ...newEvent, type: value })
// 								}
// 								className='col-span-3 flex flex-wrap gap-4'
// 							>
// 								<div className='flex items-center gap-2'>
// 									<RadioGroupItem
// 										value='patient_control'
// 										id='control'
// 									/>
// 									<Label htmlFor='control'>Control</Label>
// 								</div>
// 								<div className='flex items-center gap-2'>
// 									<RadioGroupItem value='evaluation' id='evaluacion' />
// 									<Label htmlFor='evaluacion'>Evaluación</Label>
// 								</div>
// 								<div className='flex items-center gap-2'>
// 									<RadioGroupItem value='emergency' id='urgencia' />
// 									<Label htmlFor='urgencia'>Urgencia</Label>
// 								</div>
// 							</RadioGroup>
// 						</div>

// 						<div className='grid grid-cols-4 items-start gap-4'>
// 							<Label htmlFor='notes' className='text-right pt-2'>
// 								Notas
// 							</Label>
// 							<Input
// 								id='notes'
// 								placeholder='Notas adicionales'
// 								value={newEvent.notes}
// 								onChange={(e) =>
// 									setNewEvent({ ...newEvent, notes: e.target.value })
// 								}
// 								className='col-span-3'
// 							/>
// 						</div>
// 					</div>
// 				</div>

// 				<DialogFooter>
// 					<Button variant='outline' onClick={() => onOpenChange(false)}>
// 						Cancelar
// 					</Button>
// 					<Button
// 						onClick={handleAddEvent}
// 						disabled={!newEvent.rut || !newEvent.date || !newEvent.time}
// 					>
// 						Agendar cita
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
