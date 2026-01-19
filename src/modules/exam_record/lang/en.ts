export interface ExamRecordTranslations {
  page: {
    title: string
    subtitle: string
    successMessage: string
  }
  sections: {
    personalInfo: string
    documents: string
    symptoms: string
    notesLabel: string
    fields: {
      firstName: string
      lastName: string
      rut: string
      age: string
      birthDate: string
    }
    ancestryQuestion: string
    ancestryYes: string
    ancestryNo: string
  }
  documents: {
    uploadCta: string
    uploadedLabel: string
    formatsPrefix: string
  }
  symptoms: {
    instructions: string
    otherSymptomsLabel: string
  }
  symptomLabels: Record<string, string>
  alerts: {
    submitWarning: string
  }
  buttons: {
    submit: string
    submitting: string
    errorReport: string
  }
  dialogs: {
    errorReport: {
      title: string
      description: string
      fields: {
        rut: string
        errorType: string
        description: string
      }
      placeholder: string
      typeOptions: {
        data: string
        page: string
      }
      buttons: {
        cancel: string
        submit: string
      }
    }
  }
}

export const en: ExamRecordTranslations = {
  page: {
    title: 'Patient Exam Record',
    subtitle:
      'Complete the form before your appointment so the medical team can review your status.',
    successMessage:
      'Form submitted successfully. Your medical team will review the information shortly.',
  },
  sections: {
    personalInfo: 'Personal Information',
    documents: 'Upload Documents',
    symptoms: 'Symptoms',
    notesLabel: 'Add notes or concerns',
    fields: {
      firstName: 'First name(s)',
      lastName: 'Last name(s)',
      rut: 'RUT',
      age: 'Age',
      birthDate: 'Birth date',
    },
    ancestryQuestion: 'Do you have any ancestors of African, Arabic or Mediterranean origin?',
    ancestryYes: 'Yes',
    ancestryNo: 'No',
  },
  documents: {
    uploadCta: 'Click to select a file',
    uploadedLabel: 'Uploaded file',
    formatsPrefix: 'Formats',
  },
  symptoms: {
    instructions: 'Select every symptom you have experienced since your last prescription.',
    otherSymptomsLabel: 'If you wish, you can describe other concerns or symptoms:',
  },
  symptomLabels: {
    chest_pain: 'Chest pain',
    tremors: 'Abnormal movements',
    ideas: 'Unusual thoughts',
    suicidal: 'Suicidal thoughts',
    breath: 'Shortness of breath',
    constipation_short: 'Constipation < 3 days',
    constipation_long: 'Constipation > 3 days',
    palpitations: 'Palpitations',
    dizziness: 'Dizziness',
    salivation: 'Excess salivation',
    sleepiness: 'Excessive sleepiness',
  },
  alerts: {
    submitWarning:
      'Please review your data before submitting. You will not be able to edit it afterwards.',
  },
  buttons: {
    submit: 'Send form',
    submitting: 'Sending...',
    errorReport: 'Report an error',
  },
  dialogs: {
    errorReport: {
      title: 'Report an error',
      description: 'Tell us what is wrong so we can help you as soon as possible.',
      fields: {
        rut: 'RUT',
        errorType: 'Error type',
        description: 'Explain the error',
      },
      placeholder: 'Write here...',
      typeOptions: {
        data: 'Incorrect data',
        page: 'Problem with the page',
      },
      buttons: {
        cancel: 'Cancel',
        submit: 'Send report',
      },
    },
  },
}
