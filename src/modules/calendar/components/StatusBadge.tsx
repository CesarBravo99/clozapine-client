import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
	pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
	confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
	completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
	cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

interface StatusBadgeProps {
	status: string;
	label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
				STATUS_STYLES[status] ?? STATUS_STYLES.pending
			)}
		>
			{label}
		</span>
	);
}

