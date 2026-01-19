import type { AppLanguages } from './en'

export const es: AppLanguages = {
  global: {
    layoutLabel: 'Diseño general de la aplicación Clozapina',
    header: {
      defaultUser: 'Usuario',
      userWithRut: 'Usuario {rut}',
      selectAffiliation: 'Seleccionar afiliación',
      logout: 'Cerrar sesión',
      languageAria: {
        toEnglish: 'Cambiar idioma a inglés',
        toSpanish: 'Cambiar idioma a español',
      },
    },
    footer: {
      faq: 'Preguntas frecuentes',
      privacy: 'Política de privacidad',
      help: 'Centro de ayuda',
    },
  },
  navigation: {
    mainMenu: 'Menú Principal',
    notifications: 'Notificaciones',
    patients: 'Pacientes',
    calendar: 'Calendario',
    prescriptions: 'Prescripciones',
    profile: 'Perfil',
    settings: 'Configuración',
  },
  notification: {},
}
