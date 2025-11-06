import { Sidebar } from '@/components/layout/Sidebar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/calendar')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className='container mx-auto py-6 px-4 md:px-10 h-full'>
			<div className='flex flex-col space-y-8 h-full'>
				<div className='flex gap-6 h-full'>
					<Sidebar pendingCount={0}></Sidebar>

					<main className='flex flex-col flex-grow'>
						<div className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden'>
							<div className='p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3'>
								<h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>
									Calendario
								</h1>
							</div>
							<div className='flex-1 p-4'>Calendario</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
