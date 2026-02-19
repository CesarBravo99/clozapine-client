import { createFormHook, createFormHookContexts, useStore } from '@tanstack/react-form'
import { useRouteContext } from '@tanstack/react-router'
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'
import type { ExamRecordOverview } from '@/api/exam-record'
import { reportExamError, submitExamRecord } from '@/api/exam-record'
import type { ExamRecordFormValues } from '@/api/exam-record/schemas/exam_record'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})

function _examRecordFormType() {
  return useAppForm({ defaultValues: {} as ExamRecordFormValues, onSubmit: async () => {} })
}

type ExamRecordFormInstance = ReturnType<typeof _examRecordFormType>

export function useExamRecordForm(): ExamRecordFormInstance {
  return useFormContext() as unknown as ExamRecordFormInstance
}

// Non-form context (overview + dialog + submission state)

interface ExamRecordFormContextValue {
  overview: ExamRecordOverview | null
  isSubmitting: boolean
  isErrorDialogOpen: boolean
  setErrorDialogOpen: (open: boolean) => void
  reportError: (rut: string, errorType: string, description: string) => void
  isReportingError: boolean
}

const ExamRecordFormContext = createContext<ExamRecordFormContextValue | undefined>(undefined)

export function useExamRecordFormContext() {
  const ctx = useContext(ExamRecordFormContext)
  if (!ctx) {
    throw new Error('useExamRecordFormContext must be used within ExamRecordFormProvider')
  }
  return ctx
}

// Provider

interface ExamRecordFormProviderProps {
  children: ReactNode
  overview: ExamRecordOverview | null
  rut: number | null
}

export function ExamRecordFormProvider({ children, overview }: ExamRecordFormProviderProps) {
  const routeContext = useRouteContext({ from: '__root__' })
  const axiosClient = routeContext.axiosClient

  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false)
  const [isReportingError, setReportingError] = useState(false)

  const form = useAppForm({
    defaultValues: {
      patient: {
        fullName: overview?.patient.fullName ?? '',
        lastName: overview?.patient.lastName ?? '',
        rut: overview?.patient.rut ?? '',
        age: String(overview?.patient.age ?? ''),
        birthDate: overview?.patient.birthDate ?? '',
        ancestryAnswer: overview?.patient.ancestryAnswer ?? '',
      },
      symptoms: [] as string[],
      notes: '',
      documents: {} as Record<string, string>,
    },
    onSubmit: async ({ value }) => {
      await submitExamRecord(
        {
          rut: overview?.patient.rut ?? '',
          email: '',
          symptoms: value.symptoms,
          notes: value.notes,
        },
        axiosClient
      )
    },
  })

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  const reportError = useCallback(
    async (patientRut: string, errorType: string, description: string) => {
      if (isReportingError) return
      setReportingError(true)
      await reportExamError({ rut: patientRut, errorType, description }, axiosClient)
      setReportingError(false)
      setErrorDialogOpen(false)
    },
    [axiosClient, isReportingError]
  )

  return (
    <ExamRecordFormContext.Provider
      value={{
        overview,
        isSubmitting,
        isErrorDialogOpen,
        setErrorDialogOpen,
        reportError,
        isReportingError,
      }}
    >
      <form.AppForm>{children}</form.AppForm>
    </ExamRecordFormContext.Provider>
  )
}
