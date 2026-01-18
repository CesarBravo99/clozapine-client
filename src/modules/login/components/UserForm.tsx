import { useRouteContext } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { useLoginMutation } from '@/modules/login/hooks/useLoginMutation'
import { langs } from '@/modules/login/lang'
import { useAppForm } from '@/modules/login/providers/login-form.provider'
import { selectLang } from '@/redux/settings/settings.slice'

const schema = z.object({
  requestRut: z.string().min(1, 'RUT is required'),
  requestPassword: z.string().min(1, 'Password is required'),
})

export function UserForm() {
  const routeContext = useRouteContext({ from: '__root__' })
  const { axiosClient } = routeContext
  const lang = useSelector(selectLang)
  const loginMutation = useLoginMutation(axiosClient)

  const form = useAppForm({
    defaultValues: {
      requestRut: '123456789',
      requestPassword: 'password',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  return (
    <form
      id="user-form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.AppField name="requestRut">
        {(field) => <field.TextField label={langs[lang].login.rutLabel} id="rut" />}
      </form.AppField>

      <form.AppField name="requestPassword">
        {(field) => <field.TextField label={langs[lang].login.passwordLabel} id="password" />}
      </form.AppField>

      <div className="flex justify-end">
        <form.AppForm>
          <form.SubscribeButton
            label={
              loginMutation.isPending
                ? langs[lang].userForm.submittingButtonUser
                : langs[lang].userForm.submitButtonUser
            }
            disabled={loginMutation.isPending}
            type="user"
          />
        </form.AppForm>
      </div>
    </form>
  )
}
