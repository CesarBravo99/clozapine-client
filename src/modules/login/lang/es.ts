import type { AppLanguages } from './en';

export const es: AppLanguages = {
	login: {
		rutLabel: 'RUT',
		rutPlaceholder: 'Ingrese su RUT',
		rutErrorMessage: 'RUT es requerido',
		passwordLabel: 'Contraseña',
		passwordPlaceholder: 'Ingrese su contraseña',
		passwordErrorMessage: 'Contraseña es requerida',
		emailLabel: 'Correo',
		emailPlaceholder: 'Ingrese su correo',
		emailErrorMessage: 'Correo es requerido',
	},
	userForm: {
		title: 'Bienvenido a Clozapina',
		userLabel: 'Personal',
		patientLabel: 'Paciente',
		submitButtonUser: 'Entrar como Personal',
		submittingButtonUser: 'Entrando como Personal...',
		submitButtonPatient: 'Entrar como Paciente',
		submittingButtonPatient: 'Entrando como Paciente...',
		links: {
			patient: {
				register: '¿Aún no está registrado?',
				changeHospital: 'Solicitar cambio de hospital',
			},
			personal: {
				forgotPassword: '¿Olvidó su contraseña?',
				register: '¿Necesita acceso al sistema?',
			},
		},
	},
	common: {
		submit: 'Enviar',
	},
	dialogs: {
		addPatient: {
			linkLabel: '¿Aún no está registrado?',
			title: 'Solicitud de registro de Paciente',
			description: 'Complete el formulario para que su hospital pueda registrarle.',
			fields: {
				name: 'Nombre completo',
				rut: 'RUT',
				email: 'Correo electrónico',
				phone: 'Número de teléfono',
				hospital: 'Hospital que lo atiende',
				otherHospital: 'Especifique el hospital',
			},
			placeholders: {
				name: 'Ingrese su nombre completo',
				rut: 'Ingrese su RUT',
				email: 'Ingrese su correo',
				phone: 'Ingrese su teléfono',
				hospital: 'Seleccione un hospital',
				otherHospital: 'Nombre del hospital',
			},
			hospitals: {
				curico: 'Hospital de Curicó',
				sanJuan: 'Hospital San Juan de Dios',
				other: 'Otro hospital',
			},
			buttons: {
				cancel: 'Cancelar',
				submit: 'Enviar solicitud',
			},
		},
		addUser: {
			linkLabel: '¿Necesita acceso?',
			title: 'Solicitud de registro de personal',
			description: 'Complete el formulario para solicitar acceso como personal médico.',
			fields: {
				name: 'Nombre completo',
				rut: 'RUT',
				email: 'Correo electrónico',
				phone: 'Número de teléfono',
				role: 'Rol',
				hospital: 'Hospital donde trabaja',
				otherHospital: 'Especifique el hospital',
			},
			placeholders: {
				name: 'Ingrese su nombre completo',
				rut: 'Ingrese su RUT',
				email: 'Ingrese su correo',
				phone: 'Ingrese su teléfono',
				role: 'Seleccione su rol',
				hospital: 'Seleccione un hospital',
				otherHospital: 'Nombre del hospital',
			},
			roles: {
				psychiatrist: 'Médico Psiquiatra',
				general: 'Médico General',
				nurse: 'Enfermero/a',
				assistant: 'Asistente',
				admin: 'Administrativo',
			},
			hospitals: {
				curico: 'Hospital de Curicó',
				sanJuan: 'Hospital San Juan de Dios',
				other: 'Otro hospital',
			},
			buttons: {
				cancel: 'Cancelar',
				submit: 'Enviar solicitud',
			},
		},
		affiliation: {
			linkLabel: 'Solicitar cambio de hospital',
			title: 'Solicitud de cambio de hospital',
			description: 'Complete el formulario para iniciar el proceso de cambio de hospital afiliado.',
			fields: {
				rut: 'RUT',
				email: 'Correo electrónico',
				phone: 'Número de celular',
				reason: 'Explique la razón del cambio de hospital',
				hospital: 'Hospital al que se cambia',
				otherHospital: 'Especifique el hospital',
			},
			placeholders: {
				rut: 'Ingrese su RUT',
				email: 'Ingrese su correo',
				phone: 'Ingrese su número',
				reason: 'Escriba aquí el motivo de su solicitud...',
				hospital: 'Seleccione un hospital',
				otherHospital: 'Nombre del hospital',
			},
			hospitals: {
				hide: 'Prefiero no indicar',
				curico: 'Hospital de Curicó',
				sanJuan: 'Hospital San Juan de Dios',
				other: 'Otro hospital',
			},
			buttons: {
				cancel: 'Cancelar',
				submit: 'Enviar solicitud',
				close: 'Cerrar',
			},
			successMessage: 'Su solicitud fue enviada correctamente. El hospital se pondrá en contacto cuando sea revisada.',
		},
		forgotPassword: {
			linkLabel: '¿Olvidó su contraseña?',
			title: 'Recuperar contraseña',
			description: 'Le enviaremos un correo con instrucciones para cambiarla.',
			fields: {
				rut: 'RUT',
			},
			placeholders: {
				rut: 'Ingrese su RUT',
			},
			buttons: {
				cancel: 'Cancelar',
				submit: 'Enviar solicitud',
			},
		},
	},
};
