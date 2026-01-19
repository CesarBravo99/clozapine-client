export const en = {
  login: {
    rutLabel: 'RUT',
    rutPlaceholder: 'Enter your RUT',
    rutErrorMessage: 'RUT is required',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    passwordErrorMessage: 'Password is required',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    emailErrorMessage: 'Email is required',
  },
  userForm: {
    title: 'Welcome to Clozapina',
    userLabel: 'User',
    patientLabel: 'Patient',
    submitButtonUser: 'Enter as User',
    submittingButtonUser: 'Entering as User...',
    submitButtonPatient: 'Enter as Patient',
    submittingButtonPatient: 'Entering as Patient...',
    links: {
      patient: {
        register: 'Need to register?',
        changeHospital: 'Request hospital change',
      },
      personal: {
        forgotPassword: 'Forgot your password?',
        register: 'Need access to the system?',
      },
    },
  },
  common: {
    submit: 'Submit',
  },
  dialogs: {
    addPatient: {
      linkLabel: 'Need to register?',
      title: 'Patient registration request',
      description: 'Complete the form so your hospital can register you.',
      fields: {
        name: 'Full name',
        rut: 'RUT',
        email: 'Email',
        phone: 'Phone number',
        hospital: 'Current hospital',
        otherHospital: 'Specify the hospital',
      },
      placeholders: {
        name: 'Enter your full name',
        rut: 'Enter your RUT',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        hospital: 'Select a hospital',
        otherHospital: 'Hospital name',
      },
      hospitals: {
        curico: 'Hospital de Curicó',
        sanJuan: 'Hospital San Juan de Dios',
        other: 'Other hospital',
      },
      buttons: {
        cancel: 'Cancel',
        submit: 'Send request',
      },
    },
    addUser: {
      linkLabel: 'Need access?',
      title: 'Medical staff registration',
      description: 'Fill out this form to request access as medical staff.',
      fields: {
        name: 'Full name',
        rut: 'RUT',
        email: 'Email',
        phone: 'Phone number',
        role: 'Role',
        hospital: 'Hospital',
        otherHospital: 'Specify the hospital',
      },
      placeholders: {
        name: 'Enter your full name',
        rut: 'Enter your RUT',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        role: 'Select your role',
        hospital: 'Select a hospital',
        otherHospital: 'Hospital name',
      },
      roles: {
        psychiatrist: 'Psychiatrist',
        general: 'General Practitioner',
        nurse: 'Nurse',
        assistant: 'Assistant',
        admin: 'Administrative',
      },
      hospitals: {
        curico: 'Hospital de Curicó',
        sanJuan: 'Hospital San Juan de Dios',
        other: 'Other hospital',
      },
      buttons: {
        cancel: 'Cancel',
        submit: 'Send request',
      },
    },
    affiliation: {
      linkLabel: 'Request hospital change',
      title: 'Hospital change request',
      description: 'Fill out this form to request a change of affiliated hospital.',
      fields: {
        rut: 'RUT',
        email: 'Email',
        phone: 'Phone number',
        reason: 'Explain the reason for the change',
        hospital: 'New hospital',
        otherHospital: 'Specify the hospital',
      },
      placeholders: {
        rut: 'Enter your RUT',
        email: 'Enter your email',
        phone: 'Enter your phone number',
        reason: 'Describe the reason for your request...',
        hospital: 'Select a hospital',
        otherHospital: 'Hospital name',
      },
      hospitals: {
        hide: 'Prefer not to say',
        curico: 'Hospital de Curicó',
        sanJuan: 'Hospital San Juan de Dios',
        other: 'Other hospital',
      },
      buttons: {
        cancel: 'Cancel',
        submit: 'Send request',
        close: 'Close',
      },
      successMessage:
        'Your request was sent successfully. The hospital will contact you once it is reviewed.',
    },
    forgotPassword: {
      linkLabel: 'Forgot your password?',
      title: 'Recover password',
      description: 'We will send instructions to change your password to the registered email.',
      fields: {
        rut: 'RUT',
      },
      placeholders: {
        rut: 'Enter your RUT',
      },
      buttons: {
        cancel: 'Cancel',
        submit: 'Send request',
      },
    },
  },
}

export type AppLanguages = typeof en
