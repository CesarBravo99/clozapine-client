import React from 'react';
import type { Column } from '@tanstack/react-table';
import { DebouncedInput } from './DebouncedInput';

interface FilterProps {
	column: Column<any, unknown>;
}

export const Filter: React.FC<FilterProps> = ({ column }) => {
	const columnFilterValue = column.getFilterValue();

	return (
		<DebouncedInput
			type='text'
			value={(columnFilterValue ?? '') as string}
			onChange={(value) => column.setFilterValue(value)}
			placeholder='Filtrar...'
			className='w-full px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs'
		/>
	);
};
