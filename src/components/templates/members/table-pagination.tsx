'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import RowPerPage from '@/components/atoms/row-per-page'
import ButtonPrevNext from '@/components/molecules/vs-da/button-prev-next'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    selectedRowsCount: number
    totalFilteredRowsCount: number
}

export function DataTablePaginationMember<TData>({
    table,
    selectedRowsCount,
    totalFilteredRowsCount
}: DataTablePaginationProps<TData>) {
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Row Selection Info */}
                    <Checkbox
                        id="uncheckAll"
                        checked={selectedRowsCount > 0}
                        onCheckedChange={() => {
                            table.resetRowSelection()
                        }}
                    />
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedRowsCount} of {totalFilteredRowsCount} row(s)
                        selected.
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <RowPerPage table={table} />
                    <ButtonPrevNext table={table} />
                </div>
            </div>
        </>
    )
}
