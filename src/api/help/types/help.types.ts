export interface HelpHospital {
  affiliationId: number
  name: string
}

export interface HelpOverview {
  hospitals: HelpHospital[]
  patientSubjects: string[]
  staffIssueTypes: string[]
  developerIssueTypes: string[]
  developerPriorities: string[]
}
