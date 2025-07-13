'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'
import CheckboxRowVsDA from '@/components/molecules/vs-da/checkbox-row'
import CheckboxShowLast from '@/components/molecules/vs-da/checkbox-show-last'
import CheckboxShowDate from '@/components/molecules/vs-da/checkbox-show-date'
import ShowingData from '@/components/molecules/vs-da/showing-data'
import ButtonPrevNext from '@/components/molecules/vs-da/button-prev-next'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    selectedRowsCount: number
    totalFilteredRowsCount: number
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    showDateHeader: boolean
    setShowDateHeader: (value: boolean) => void
}

export function DataTablePaginationVsDA<TData>({
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
                        <CheckboxRowVsDA
                            table={table}
                            selectedRowsCount={selectedRowsCount}
                            totalFilteredRowsCount={totalFilteredRowsCount}
                        />

                        <div className="flex gap-3">
                            <CheckboxShowLast
                                showFromLast={showFromLast}
                                setShowFromLast={setShowFromLast}
                            />
                            <CheckboxShowDate
                                showDateHeader={showDateHeader}
                                setShowDateHeader={setShowDateHeader}
                            />
                        </div>
                    </div>

                    <ButtonPrevNext table={table} />
                </div>

                <div className="flex min-w-max flex-col items-center gap-2 lg:hidden">
                    <div className="flex w-full items-center justify-between gap-3">
                        <CheckboxShowLast
                            showFromLast={showFromLast}
                            setShowFromLast={setShowFromLast}
                        />
                        <CheckboxShowDate
                            showDateHeader={showFromLast}
                            setShowDateHeader={setShowFromLast}
                        />
                    </div>
                    <div className="flex w-full items-center justify-between gap-3">
                        <CheckboxRowVsDA
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
