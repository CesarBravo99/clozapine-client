import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    const state = context.store.getState()
    const isLoggedIn = state.session?.isLoggedIn
    const userRut = state.session?.userRut

    // If user has an active session, redirect to notifications
    if (isLoggedIn && userRut) {
      throw redirect({ to: '/notifications' })
    }

    // Otherwise, redirect to login
    throw redirect({ to: '/login' })
  },
})
