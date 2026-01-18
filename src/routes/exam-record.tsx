import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { getExamRecordOverview } from '@/api/exam-record'
import {
  DocumentUploadSection,
  PersonalInfoCard,
  SubmitSection,
  SymptomsSection,
} from '@/modules/exam_record/components'
import { useExamRecordContext } from '@/modules/exam_record/contexts'
import { ErrorReportDialog } from '@/modules/exam_record/dialog'
import { langs } from '@/modules/exam_record/lang'
import { ExamRecordProvider } from '@/modules/exam_record/providers'
import { selectLang } from '@/redux/settings/settings.slice'

export const Route = createFileRoute('/exam-record')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { store, axiosClient } = context
    const state = store.getState()
    const userRut = state.session?.userRut ?? null
    const overview = await getExamRecordOverview(userRut, axiosClient)
    return { overview, userRut }
  },
})

function RouteComponent() {
  const { overview } = Route.useLoaderData()

  return (
    <ExamRecordProvider overview={overview}>
      <ExamRecordContent />
      <ErrorReportDialog />
    </ExamRecordProvider>
  )
}

function ExamRecordContent() {
  const lang = useSelector(selectLang)
  const text = langs[lang]
  const { overview } = useExamRecordContext()

  if (!overview) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-300">
          {text.page.subtitle}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {text.page.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{text.page.subtitle}</p>
        </div>
        <PersonalInfoCard />
        <DocumentUploadSection />
        <SymptomsSection />
        <SubmitSection />
      </div>
    </div>
  )
}
