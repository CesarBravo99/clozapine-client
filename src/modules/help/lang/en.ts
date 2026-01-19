export interface HelpModuleTranslations {
  page: {
    title: string
    description: string
  }
  tabs: {
    patient: string
    staff: string
    developer: string
  }
  components: {
    hero: {
      simulateLogin: string
    }
    banners: {
      patient: string
      staff: string
      developer: string
    }
    forms: {
      name: string
      rut: string
      email: string
      phone: string
      hospital: string
      otherHospital: string
      message: string
      subject: string
      issueType: string
      priority: string
      send: string
    }
    staffBanner: {
      title: string
      description: string
      requireLogin: string
      login: string
    }
  }
  messages: {
    formSubmitted: string
    loggedIn: string
  }
}

export const en: HelpModuleTranslations = {
  page: {
    title: 'Help Center',
    description: 'Select the type of assistance you need and fill out the form below.',
  },
  tabs: {
    patient: 'Patient',
    staff: 'Staff',
    developer: 'Developers',
  },
  components: {
    hero: {
      simulateLogin: 'Simulate staff login',
    },
    banners: {
      patient:
        'Use this form to contact your hospital about treatment doubts or urgent medical questions.',
      staff: 'Reach the hospital administrators about account access and permissions.',
      developer:
        'Report bugs, request new features, or send technical feedback to the development team.',
    },
    forms: {
      name: 'Full name',
      rut: 'RUT',
      email: 'Email',
      phone: 'Phone',
      hospital: 'Hospital',
      otherHospital: 'Specify hospital',
      message: 'Message',
      subject: 'Subject',
      issueType: 'Issue type',
      priority: 'Priority',
      send: 'Send message',
    },
    staffBanner: {
      title: 'Restricted access',
      description: 'This section is available only for logged-in staff members.',
      requireLogin: 'Please sign in to access this form.',
      login: 'Go to login',
    },
  },
  messages: {
    formSubmitted: 'We received your message. We will respond shortly.',
    loggedIn: 'You are now logged in as staff.',
  },
}
