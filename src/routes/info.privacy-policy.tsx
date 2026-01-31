import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/info/privacy-policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <title>Política de Privacidad | Clozapina</title>
      Hello "/info/privacy-policy"!
    </div>
  )
}
