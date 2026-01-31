import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/info/common-questions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <title>Preguntas Frecuentes | Clozapina</title>
      Hello "/info/common-questions"!
    </div>
  )
}
