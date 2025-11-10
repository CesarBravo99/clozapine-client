import { useMemo, useState } from 'react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	useReactTable,
	type ColumnFiltersState,
	type SortingState,
	type FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Button } from '@/components/ui/button';
import { DebouncedInput } from './DebouncedInput';
import { Filter } from './Filter';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/settings.slice';
import { langs } from '../lang';
import type { PatientTableData } from '@/api/patients/types/patient.types';
import { usePatients } from '../context/PatientsContext';

interface PatientsTableProps {
	data: PatientTableData[];
	isLoading?: boolean;
	error?: string | null;
}

const columnHelper = createColumnHelper<PatientTableData>();

// Define a custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({ itemRank });
	return itemRank.passed;
};

export function PatientsTable({ data, isLoading, error }: PatientsTableProps) {
	const lang = useSelector(selectLang);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const { openPatientDetails } = usePatients();

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].patients.tableColumns.name}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const name = getValue() as string;
					return (
						<div className='font-medium text-gray-900 dark:text-gray-100'>{name}</div>
					);
				},
				filterFn: 'fuzzy',
			}),
			columnHelper.accessor('patientRut', {
				id: 'rut',
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].patients.tableColumns.rut}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const rut = getValue() as number;
					return <div className='text-sm text-gray-600 dark:text-gray-400'>{rut}</div>;
				},
				filterFn: 'equalsString',
			}),
			columnHelper.accessor('age', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].patients.tableColumns.age}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const age = getValue() as number;
					return <div className='text-sm text-gray-600 dark:text-gray-400'>{age}</div>;
				},
				filterFn: 'equalsString',
			}),
			columnHelper.accessor('state', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].patients.tableColumns.state}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const state = getValue() as string;

					// Map state to appropriate styles
					let className =
						'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';

					if (state === 'inactive') {
						className =
							'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
					} else if (state === 'suspended') {
						className = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
					}

					// Map state to language strings
					const stateLabels = {
						active: langs[lang].patients.states.active,
						inactive: langs[lang].patients.states.inactive,
						suspended: langs[lang].patients.states.suspended,
					};

					const displayState = stateLabels[state as keyof typeof stateLabels] || state;

					return (
						<span
							className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
						>
							{displayState}
						</span>
					);
				},
				filterFn: 'equalsString',
			}),
			columnHelper.accessor('lastControl', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].patients.tableColumns.lastControl}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const lastControl = getValue() as string;
					return (
						<div className='text-sm text-gray-600 dark:text-gray-400'>
							{lastControl || '-'}
						</div>
					);
				},
				filterFn: 'includesString',
			}),
		],
		[lang]
	);

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: 'fuzzy',
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>
						{langs[lang].components.patientsTable.loading}
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>
					<p className='text-red-600 dark:text-red-400'>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Search and Filters */}
			<div className='flex flex-col sm:flex-row gap-4 mb-4'>
				<div className='flex-1'>
					<DebouncedInput
						value={globalFilter ?? ''}
						onChange={(value) => setGlobalFilter(String(value))}
						placeholder={langs[lang].components.patientsTable.search}
						className='w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
					/>
				</div>
			</div>

			{/* Table */}
			<div className='overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
				<table className='w-full text-sm text-gray-900 dark:text-gray-200'>
					<thead className='bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										colSpan={header.colSpan}
										className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
									>
										{header.isPlaceholder ? null : (
											<>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getCanFilter() ? (
													<div className='mt-2'>
														<Filter column={header.column} />
													</div>
												) : null}
											</>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
									onClick={() => openPatientDetails(row.original)}
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className='px-6 py-4 whitespace-nowrap'>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'
								>
									{langs[lang].components.patientsTable.noResults}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<button
						className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						{'<<'}
					</button>
					<button
						className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{langs[lang].components.patientsTable.previous}
					</button>
					<button
						className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{langs[lang].components.patientsTable.next}
					</button>
					<button
						className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						{'>>'}
					</button>
				</div>

				<div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
					<span>
						{langs[lang].components.patientsTable.page}{' '}
						<strong>{table.getState().pagination.pageIndex + 1}</strong>{' '}
						{langs[lang].components.patientsTable.of}{' '}
						<strong>{table.getPageCount()}</strong>
					</span>
					<span>
						<strong>{table.getPrePaginationRowModel().rows.length}</strong>{' '}
						{langs[lang].patients.title.toLowerCase()}
					</span>
				</div>

				<div className='flex items-center gap-2'>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						{langs[lang].components.patientsTable.rowsPerPage}:
					</span>
					<select
						value={table.getState().pagination.pageSize}
						onChange={(e) => table.setPageSize(Number(e.target.value))}
						className='px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								{pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
