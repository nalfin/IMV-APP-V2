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
import { MemberTableType } from '@/types/member.type'
import { DataTableToolbarMember } from '@/components/templates/members/table-toolbar'
import { DataTableViewMember } from '@/components/templates/members/table-view'
import { DataTablePaginationMember } from '@/components/templates/members/table-pagination'

interface MemberDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    onBulkEditOpen: (selected: MemberTableType[]) => void
    onSuccess: () => void
}

export function MemberDataTable<TData extends MemberTableType, TValue>({
    columns,
    onSuccess,
    data,
    showFromLast,
    setShowFromLast,
    onBulkEditOpen
}: MemberDataTableProps<TData, TValue>) {
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
        <div className="min-w-full space-y-3 font-mono">
            <DataTableToolbarMember
                table={table}
                onSuccess={onSuccess}
                selectedRows={selectedRows}
                showFromLast={showFromLast}
                setShowFromLast={setShowFromLast}
                onBulkEditOpen={onBulkEditOpen}
            />
            <DataTableViewMember table={table} columnsLength={columns.length} />
            <DataTablePaginationMember
                table={table}
                selectedRowsCount={selectedRows.length}
                totalFilteredRowsCount={table.getFilteredRowModel().rows.length}
            />
        </div>
    )
}
