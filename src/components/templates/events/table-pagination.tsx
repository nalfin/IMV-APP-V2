'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import CheckboxRowVsDA from '@/components/molecules/vs-da/checkbox-row'
import CheckboxShowLast from '@/components/molecules/vs-da/checkbox-show-last'
import CheckboxShowDate from '@/components/molecules/vs-da/checkbox-show-date'
import ButtonPrevNext from '@/components/molecules/vs-da/button-prev-next'
import CheckboxRowEvent from '@/components/molecules/events/checkbox-row'
import CheckboxShowLastEvent from '@/components/molecules/events/checkbox-show-last'
import CheckboxShowDateEvent from '@/components/molecules/events/checkbox-show-date'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    selectedRowsCount: number
    totalFilteredRowsCount: number
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    showDateHeader: boolean
    setShowDateHeader: (value: boolean) => void
}

export function DataTablePaginationEvent<TData>({
    table,
    showFromLast,
    setShowFromLast,
    showDateHeader,
    setShowDateHeader,
    selectedRowsCount,
    totalFilteredRowsCount
}: DataTablePaginationProps<TData>) {
    return (
        <>
            <div>
                <div className="hidden lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <CheckboxRowEvent
                            table={table}
                            selectedRowsCount={selectedRowsCount}
                            totalFilteredRowsCount={totalFilteredRowsCount}
                        />

                        <div className="flex gap-3">
                            <CheckboxShowLastEvent
                                showFromLast={showFromLast}
                                setShowFromLast={setShowFromLast}
                            />
                            <CheckboxShowDateEvent
                                showDateHeader={showDateHeader}
                                setShowDateHeader={setShowDateHeader}
                            />
                        </div>
                    </div>

                    <ButtonPrevNext table={table} />
                </div>

                <div className="flex min-w-max flex-col items-center gap-2 lg:hidden">
                    <div className="flex w-full items-center justify-between gap-3">
                        <CheckboxShowLastEvent
                            showFromLast={showFromLast}
                            setShowFromLast={setShowFromLast}
                        />
                        <CheckboxShowDateEvent
                            showDateHeader={showFromLast}
                            setShowDateHeader={setShowFromLast}
                        />
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                        <CheckboxRowEvent
                            table={table}
                            selectedRowsCount={selectedRowsCount}
                            totalFilteredRowsCount={totalFilteredRowsCount}
                        />
                        <ButtonPrevNext table={table} />
                    </div>
                </div>
            </div>
        </>
    )
}
