import { z } from 'zod'

export const ExamPatientInfoSchema = z.object({
  fullName: z.string(),
  lastName: z.string(),
  rut: z.string(),
  age: z.number(),
  birthDate: z.string(),
  ancestryQuestion: z.string(),
  ancestryAnswer: z.string(),
})

export const ExamDocumentRequirementSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  supportedTypes: z.array(z.string()),
})

export const ExamSymptomOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
})

export const ExamRecordOverviewSchema = z.object({
  patient: ExamPatientInfoSchema,
  documents: z.array(ExamDocumentRequirementSchema),
  symptoms: z.array(ExamSymptomOptionSchema),
  lastUpdated: z.string(),
})

export const ExamRecordSubmissionSchema = z.object({
  rut: z.string(),
  email: z.string(),
  symptoms: z.array(z.string()),
  notes: z.string().optional(),
})

export const ExamErrorReportPayloadSchema = z.object({
  rut: z.string(),
  errorType: z.string(),
  description: z.string(),
})

export const ExamRecordFormSchema = z.object({
  patient: z.object({
    fullName: z.string(),
    lastName: z.string(),
    rut: z.string(),
    age: z.string(),
    birthDate: z.string(),
    ancestryAnswer: z.string(),
  }),
  symptoms: z.array(z.string()),
  notes: z.string(),
  documents: z.record(z.string(), z.string()),
})

export type ExamRecordFormValues = z.infer<typeof ExamRecordFormSchema>
