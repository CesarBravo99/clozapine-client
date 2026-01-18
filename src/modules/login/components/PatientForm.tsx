import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { langs } from '@/modules/login/lang'
import { useAppForm } from '@/modules/login/providers/login-form.provider'
import { selectLang } from '@/redux/settings/settings.slice'

export function PatientForm() {
  const router = useRouter()
  const lang = useSelector(selectLang)
  const [isSubmitting, setSubmitting] = useState(false)

  const schema = z.object({
    requestRut: z.string().min(1, langs[lang].login.rutErrorMessage),
    patientEmail: z.string().min(1, langs[lang].login.emailErrorMessage).email(),
  })

  const form = useAppForm({
    defaultValues: {
      requestRut: '912345678',
      patientEmail: 'juan.perez@gmail.com',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async () => {
      if (isSubmitting) return
      setSubmitting(true)
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSubmitting(false)
      router.navigate({ to: '/exam-record' })
    },
  })

  return (
    <form
      id="patient-form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.AppField name="requestRut">
        {(field) => (
          <field.TextField
            label={langs[lang].login.rutLabel}
            placeholder={langs[lang].login.rutPlaceholder}
          />
        )}
      </form.AppField>

      <form.AppField name="patientEmail">
        {(field) => (
          <field.TextField
            label={langs[lang].login.emailLabel}
            placeholder={langs[lang].login.emailPlaceholder}
          />
        )}
      </form.AppField>

      <div className="flex justify-end">
        <form.AppForm>
          <form.SubscribeButton
            label={
              isSubmitting
                ? langs[lang].userForm.submittingButtonPatient
                : langs[lang].userForm.submitButtonPatient
            }
            disabled={isSubmitting}
            type="patient"
          />
        </form.AppForm>
      </div>
    </form>
  )
}
