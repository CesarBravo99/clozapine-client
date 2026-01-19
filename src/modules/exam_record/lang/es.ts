import type { ExamRecordTranslations } from './en'

export const es: ExamRecordTranslations = {
  page: {
    title: 'Formulario de Control de Paciente',
    subtitle:
      'Complete este formulario antes de su control para que el equipo médico pueda revisar su estado.',
    successMessage:
      'Formulario enviado correctamente. El equipo médico revisará la información pronto.',
  },
  sections: {
    personalInfo: 'Información personal',
    documents: 'Subir documentos',
    symptoms: 'Síntomas',
    notesLabel: 'Agregue notas o inquietudes',
    fields: {
      firstName: 'Nombre(s)',
      lastName: 'Apellidos',
      rut: 'RUT',
      age: 'Edad',
      birthDate: 'Fecha de nacimiento',
    },
    ancestryQuestion: '¿Tiene algún antepasado de origen Africano, Arábico o del Mediterráneo?',
    ancestryYes: 'Sí',
    ancestryNo: 'No',
  },
  documents: {
    uploadCta: 'Haga clic para seleccionar un archivo',
    uploadedLabel: 'Archivo cargado',
    formatsPrefix: 'Formatos',
  },
  symptoms: {
    instructions:
      'Marque los síntomas que ha presentado desde la última vez que se le recetó Clozapina.',
    otherSymptomsLabel: 'Si desea, indíquenos otras inquietudes o síntomas:',
  },
  symptomLabels: {
    chest_pain: 'Dolor de pecho',
    tremors: 'Movimientos anormales',
    ideas: 'Ideas extrañas',
    suicidal: 'Pensamientos suicidas',
    breath: 'Falta de aire',
    constipation_short: 'Constipación < 3 días',
    constipation_long: 'Constipación > 3 días',
    palpitations: 'Palpitaciones',
    dizziness: 'Mareos',
    salivation: 'Salivación excesiva',
    sleepiness: 'Somnolencia excesiva',
  },
  alerts: {
    submitWarning:
      'Revise bien sus datos antes de enviarlos. No se pueden modificar una vez enviados.',
  },
  buttons: {
    submit: 'Enviar formulario',
    submitting: 'Enviando...',
    errorReport: 'Reportar un error',
  },
  dialogs: {
    errorReport: {
      title: 'Reportar un error',
      description: 'Cuéntenos qué ocurre para que podamos ayudarle lo antes posible.',
      fields: {
        rut: 'RUT',
        errorType: 'Tipo de error',
        description: 'Explique el problema',
      },
      placeholder: 'Escriba aquí...',
      typeOptions: {
        data: 'Error en mis datos',
        page: 'Problema con la página',
      },
      buttons: {
        cancel: 'Cancelar',
        submit: 'Enviar reporte',
      },
    },
  },
}
