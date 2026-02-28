import { useSelector } from 'react-redux'
import { useLoginMutation } from '@/modules/login/hooks/useLoginMutation'
import { useAppForm } from '@/modules/login/providers/login-form.provider'
import { selectLang } from '@/redux/settings/settings.slice'

export const useLoginForm = () => {
  const lang = useSelector(selectLang)
  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues: {
      userType: 'patient',
      requestRut: '',
      requestPassword: '',
    },
    onSubmit: ({ value }) => {
      loginMutation.mutate(value)
    },
  })

  return {
    form,
    loginMutation,
    lang,
  }
}
