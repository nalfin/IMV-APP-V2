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
import { DateRange } from 'react-day-picker'
import { EventTableType } from '@/types/event.type'
import { DataTableToolbarEvent } from '@/components/templates/events/table-toolbar'
import { DataTableViewEvent } from '@/components/templates/events/table-view'
import { DataTablePaginationEvent } from '@/components/templates/events/table-pagination'

interface EventDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showFromLast: boolean
    showDateHeader: boolean
    setShowDateHeader: (value: boolean) => void
    setShowFromLast: (value: boolean) => void
    // onBulkEditOpen: (selected: EventTableType[]) => void
    // onSuccess: () => void
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function EventDataTable<TData extends EventTableType, TValue>({
    columns,
    // onSuccess,
    data,
    showFromLast,
    setShowFromLast,
    showDateHeader,
    setShowDateHeader,
    dateRange,
    setDateRange
    // onBulkEditOpen
}: EventDataTableProps<TData, TValue>) {
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
            <DataTableToolbarEvent
                table={table}
                selectedRows={selectedRows}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <DataTableViewEvent table={table} columnsLength={columns.length} />
            <DataTablePaginationEvent
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
