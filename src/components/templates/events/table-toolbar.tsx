'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/atoms/input'
import { DateRange } from 'react-day-picker'
import { EventTableType } from '@/types/event.type'
import { DatePickRangeEvent } from '@/components/templates/events/date-pick-range'
import { DataTableViewOptionsVsDA } from '@/components/atoms/data-table-view-options-vsda'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    selectedRows: TData[]
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DataTableToolbarEvent<TData extends EventTableType>({
    table,
    dateRange,
    setDateRange
}: DataTableToolbarProps<TData>) {
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
            </div>

            {/* Show From Last Checkbox and Add Member Dialog */}
            <div className="flex flex-row gap-3">
                <DataTableViewOptionsVsDA table={table} />
                <DatePickRangeEvent
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </div>
    )
}
