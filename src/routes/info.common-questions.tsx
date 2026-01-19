import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/info/common-questions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/info/common-questions"!</div>
}
