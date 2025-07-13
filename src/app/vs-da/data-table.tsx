'use client'

import * as React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    VisibilityState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { DataTableToolbarVsDA } from '@/components/templates/vs-da/table-toolbar'
import { DataTableViewVsDA } from '@/components/templates/vs-da/table-view'
import { DataTablePaginationVsDA } from '@/components/templates/vs-da/table-pagination'
import { DateRange } from 'react-day-picker'
import { VsDATableType } from '@/types/vsda.type'

interface VsDADataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showFromLast: boolean
    showDateHeader: boolean
    setShowDateHeader: (value: boolean) => void
    setShowFromLast: (value: boolean) => void
    onBulkEditOpen: (selected: VsDATableType[]) => void
    onSuccess: () => void
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function VsDADataTable<TData extends VsDATableType, TValue>({
    columns,
    onSuccess,
    data,
    showFromLast,
    setShowFromLast,
    showDateHeader,
    setShowDateHeader,
    dateRange,
    setDateRange,
    onBulkEditOpen
}: VsDADataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)

    return (
        <div className="min-w-full space-y-6 font-mono">
            <DataTableToolbarVsDA
                table={table}
                onSuccess={onSuccess}
                selectedRows={selectedRows}
                onBulkEditOpen={onBulkEditOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <DataTableViewVsDA table={table} columnsLength={columns.length} />
            <DataTablePaginationVsDA
                table={table}
                selectedRowsCount={selectedRows.length}
                totalFilteredRowsCount={table.getFilteredRowModel().rows.length}
                showFromLast={showFromLast}
                setShowFromLast={setShowFromLast}
                showDateHeader={showDateHeader}
                setShowDateHeader={setShowDateHeader}
            />
        </div>
    )
}
