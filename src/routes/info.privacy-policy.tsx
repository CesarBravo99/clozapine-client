import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/info/privacy-policy')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/info/privacy-policy"!</div>;
}
