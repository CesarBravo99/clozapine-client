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
import type { PrescriptionTableData } from '@/api/prescriptions/types/prescription.types';
import { usePrescriptionsContext } from '../contexts/PrescriptionsContext';

interface PrescriptionsTableProps {
	data: PrescriptionTableData[];
	isLoading?: boolean;
	error?: string | null;
}

const columnHelper = createColumnHelper<PrescriptionTableData>();

// Define a custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({ itemRank });
	return itemRank.passed;
};

export function PrescriptionsTable({ data, isLoading, error }: PrescriptionsTableProps) {
	const lang = useSelector(selectLang);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState('');
	const { openPrescriptionDetail } = usePrescriptionsContext();

	const columns = useMemo(
		() => [
			columnHelper.accessor('patientName', {
				id: 'patient',
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].prescriptions.tableColumns.patient}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue, row }) => {
					const patientName = getValue() as string;
					const patientRut = row.original.patientRut;
					return (
						<div className='font-medium text-gray-900 dark:text-gray-100'>
							<div>{patientName}</div>
							<div className='text-xs text-gray-500 dark:text-gray-400'>
								RUT: {patientRut}
							</div>
						</div>
					);
				},
				filterFn: 'fuzzy',
			}),
			columnHelper.accessor('medication', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].prescriptions.tableColumns.medication}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const medication = getValue() as string;
					return (
						<div className='text-sm text-gray-900 dark:text-gray-100'>{medication}</div>
					);
				},
				filterFn: 'fuzzy',
			}),
			columnHelper.accessor('prescriptionDate', {
				id: 'date',
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].prescriptions.tableColumns.date}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const date = getValue() as string;
					return <div className='text-sm text-gray-600 dark:text-gray-400'>{date}</div>;
				},
				filterFn: 'includesString',
			}),
			columnHelper.accessor('status', {
				header: ({ column }) => {
					return (
						<div
							className={`cursor-pointer select-none hover:text-blue-400 transition-colors flex items-center gap-1 ${
								column.getCanSort() ? 'cursor-pointer' : ''
							}`}
							onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
						>
							{langs[lang].prescriptions.tableColumns.status}
							{{
								asc: ' 🔼',
								desc: ' 🔽',
							}[column.getIsSorted() as string] ?? null}
						</div>
					);
				},
				cell: ({ getValue }) => {
					const status = getValue() as string;

					// Map status to appropriate styles
					let className =
						'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';

					if (status === 'suspended') {
						className =
							'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
					} else if (status === 'completed') {
						className =
							'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
					}

					// Map status to language strings
					const statusLabels = {
						active: langs[lang].prescriptions.statuses.active,
						suspended: langs[lang].prescriptions.statuses.suspended,
						completed: langs[lang].prescriptions.statuses.completed,
					};

					const displayStatus =
						statusLabels[status as keyof typeof statusLabels] || status;

					return (
						<span
							className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
						>
							{displayStatus}
						</span>
					);
				},
				filterFn: 'equalsString',
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
						{langs[lang].components.prescriptionsTable.loading}
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
						placeholder={langs[lang].components.prescriptionsTable.search}
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
									className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring focus-visible:ring-blue-500'
									onClick={() => openPrescriptionDetail(row.original)}
									onKeyDown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											event.preventDefault();
											openPrescriptionDetail(row.original);
										}
									}}
									role='button'
									tabIndex={0}
									aria-label={`${langs[lang].components.prescriptionsTable.viewDetails} - ${
										row.original.patientName
									}`}
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
									{langs[lang].components.prescriptionsTable.noResults}
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
						{langs[lang].components.prescriptionsTable.previous}
					</button>
					<button
						className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{langs[lang].components.prescriptionsTable.next}
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
						{langs[lang].components.prescriptionsTable.page}{' '}
						<strong>{table.getState().pagination.pageIndex + 1}</strong>{' '}
						{langs[lang].components.prescriptionsTable.of}{' '}
						<strong>{table.getPageCount()}</strong>
					</span>
					<span>
						<strong>{table.getPrePaginationRowModel().rows.length}</strong>{' '}
						{langs[lang].prescriptions.title.toLowerCase()}
					</span>
				</div>

				<div className='flex items-center gap-2'>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						{langs[lang].components.prescriptionsTable.rowsPerPage}:
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
