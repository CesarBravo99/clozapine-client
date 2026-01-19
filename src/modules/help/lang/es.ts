import type { HelpModuleTranslations } from './en'

export const es: HelpModuleTranslations = {
  page: {
    title: 'Centro de Ayuda',
    description: 'Seleccione el tipo de ayuda que necesita y complete el formulario.',
  },
  tabs: {
    patient: 'Paciente',
    staff: 'Personal',
    developer: 'Desarrolladores',
  },
  components: {
    hero: {
      simulateLogin: 'Simular ingreso del personal',
    },
    banners: {
      patient:
        'Use este formulario para contactar a su hospital por dudas de tratamiento o urgencias.',
      staff: 'Comuníquese con los administradores de su hospital sobre accesos y permisos.',
      developer:
        'Reporte errores, solicite nuevas funciones o entregue feedback técnico al equipo.',
    },
    forms: {
      name: 'Nombre completo',
      rut: 'RUT',
      email: 'Correo',
      phone: 'Teléfono',
      hospital: 'Hospital',
      otherHospital: 'Especifique el hospital',
      message: 'Mensaje',
      subject: 'Asunto',
      issueType: 'Tipo de consulta',
      priority: 'Prioridad',
      send: 'Enviar mensaje',
    },
    staffBanner: {
      title: 'Acceso restringido',
      description: 'Esta sección está disponible solo para personal autenticado.',
      requireLogin: 'Inicie sesión para acceder a este formulario.',
      login: 'Ir al inicio de sesión',
    },
  },
  messages: {
    formSubmitted: 'Recibimos su mensaje. Responderemos a la brevedad.',
    loggedIn: 'Sesión iniciada como personal.',
  },
}
