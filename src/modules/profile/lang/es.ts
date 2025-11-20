import type { ProfileModuleTranslations } from './en';

export const es: ProfileModuleTranslations = {
	page: {
		title: 'Perfil de Usuario',
		loading: 'Cargando información del perfil...',
		noSession: 'No se detectó una sesión activa.',
		error: 'Hubo un problema al cargar tu perfil. Inténtalo nuevamente más tarde.',
		userLabel: 'RUT:',
	},
	components: {
		tabs: {
			personal: 'Personal',
			security: 'Seguridad',
			preferences: 'Preferencias',
		},
		leftSidebar: {
			sectionTitle: 'MI CUENTA',
			profile: 'Mi perfil',
			preferences: 'Preferencias',
			security: 'Seguridad',
			changeAffiliation: 'Cambiar afiliación',
		},
		personalInfo: {
			title: 'Información Personal',
			name: 'Nombre completo',
			rut: 'RUT',
			sex: 'Sexo',
			birthDate: 'Fecha de nacimiento',
			age: 'Edad',
			ageWithValue: '{value} años',
			accountCreated: 'Cuenta creada',
			currentHospital: 'Hospital actual',
			noAffiliation: 'Sin afiliación seleccionada',
			changeAffiliation: 'Cambiar',
		},
		contactInfo: {
			title: 'Información de Contacto',
			emailLabel: 'Correo electrónico',
			emailPlaceholder: 'correo@ejemplo.com',
			phoneLabel: 'Número de contacto',
			phonePlaceholder: '+56 9 1234 5678',
			save: 'Guardar cambios',
			saving: 'Guardando...',
		},
		preferences: {
			notificationsTitle: 'Notificaciones',
			emailNotifications: 'Notificaciones por correo',
			appNotifications: 'Notificaciones en la aplicación',
			save: 'Guardar preferencias',
			saving: 'Guardando...',
			appearanceTitle: 'Apariencia',
			themeLabel: 'Tema',
			darkModeLabel: 'Modo oscuro',
			lightModeLabel: 'Modo claro',
			changeToLight: 'Cambiar a claro',
			changeToDark: 'Cambiar a oscuro',
			fontSizeLabel: 'Tamaño de texto',
			fontSizes: {
				small: 'Pequeño',
				medium: 'Mediano',
				large: 'Grande',
			},
		},
		securitySummary: {
			title: 'Información de Seguridad',
			role: 'Rol',
			lastLogin: 'Último acceso',
			passwordChanged: 'Contraseña cambiada',
			accountCreated: 'Cuenta creada',
			yes: 'Sí',
			no: 'No',
		},
	},
	dialogs: {
		affiliationSelector: {
			title: 'Seleccionar hospital',
			description: 'Elige la afiliación con la que deseas trabajar.',
			confirm: 'Confirmar selección',
		},
	},
	messages: {
		contactSaved: 'Información de contacto actualizada correctamente',
		preferencesSaved: 'Preferencias guardadas correctamente',
		affiliationUpdated: 'Afiliación actualizada correctamente',
	},
};

