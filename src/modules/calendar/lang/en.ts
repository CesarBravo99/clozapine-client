export interface CalendarModuleTranslations {
  page: {
    title: string
    addEvent: string
    today: string
    searchPlaceholder: string
    viewLabels: {
      day: string
      week: string
      month: string
    }
  }
  components: {
    leftSidebar: {
      quickActions: string
      addEvent: string
      goToday: string
    }
    statusLegend: {
      title: string
      pending: string
      confirmed: string
      completed: string
      cancelled: string
    }
  }
  dialogs: {
    addEvent: {
      title: string
      description: string
      cancel: string
      confirm: string
    }
    eventDetails: {
      title: string
      cancel: string
      delete: string
      statusLabel: string
    }
    affiliationSelector: {
      title: string
      description: string
      confirm: string
    }
  }
  messages: {
    eventCreated: string
    eventStatusUpdated: string
    eventDeleted: string
  }
}

export const en: CalendarModuleTranslations = {
  page: {
    title: 'Calendar',
    addEvent: 'New appointment',
    today: 'Today',
    searchPlaceholder: 'Search patient by name or RUT…',
    viewLabels: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
    },
  },
  components: {
    leftSidebar: {
      quickActions: 'QUICK ACTIONS',
      addEvent: 'Schedule appointment',
      goToday: 'Go to today',
    },
    statusLegend: {
      title: 'Status legend',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
  },
  dialogs: {
    addEvent: {
      title: 'Schedule appointment',
      description: 'Complete the information to add a new appointment.',
      cancel: 'Cancel',
      confirm: 'Schedule',
    },
    eventDetails: {
      title: 'Appointment details',
      cancel: 'Close',
      delete: 'Delete appointment',
      statusLabel: 'Status',
    },
    affiliationSelector: {
      title: 'Select hospital',
      description: 'Choose the affiliation you want to manage.',
      confirm: 'Confirm selection',
    },
  },
  messages: {
    eventCreated: 'Appointment scheduled successfully',
    eventStatusUpdated: 'Appointment status updated',
    eventDeleted: 'Appointment removed',
  },
}
