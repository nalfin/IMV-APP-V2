'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { useSession } from 'next-auth/react'
import { DateRange } from 'react-day-picker'
import { DatePickRangeVsDA } from '@/components/templates/vs-da/date-pick-range'
import { VsDATableType } from '@/types/vsda.type'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    selectedRows: TData[]

    onBulkEditOpen: (selected: VsDATableType[]) => void
    onSuccess: () => void
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DataTableToolbarVsDA<TData extends VsDATableType>({
    table,
    selectedRows,
    dateRange,
    setDateRange,
    onBulkEditOpen
}: DataTableToolbarProps<TData>) {
    const { data: session } = useSession()
    const role = (session?.user as { role: string })?.role ?? 'unknown'

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="flex w-full items-center gap-6 md:max-w-md md:gap-4">
                <Input
                    className="w-full"
                    placeholder="Search by name..."
                    value={
                        (table
                            .getColumn('member_name')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('member_name')
                            ?.setFilterValue(event.target.value)
                    }
                />
                {role === 'admin' && (
                    <Button
                        variant="outline"
                        size="default"
                        className="rounded-sm"
                        onClick={() => onBulkEditOpen(selectedRows)}
                        disabled={selectedRows.length === 0}
                    >
                        Edit Selected
                    </Button>
                )}
            </div>

            {/* Show From Last Checkbox and Add Member Dialog */}
            <div className="flex justify-between gap-3">
                <DatePickRangeVsDA
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </div>
    )
}
