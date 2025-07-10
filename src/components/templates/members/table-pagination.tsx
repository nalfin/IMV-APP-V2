'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'

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
        <div className="flex items-center justify-end space-x-2 py-4">
            {/* Row Selection Info */}
            <Checkbox
                id="uncheckAll"
                checked={selectedRowsCount > 0}
                onCheckedChange={() => {
                    table.resetRowSelection()
                }}
            />
            <div className="flex-1 text-sm text-muted-foreground">
                {selectedRowsCount} of {totalFilteredRowsCount} row(s) selected.
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
