'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { DateRange } from 'react-day-picker'
import { formatInTimeZone } from 'date-fns-tz'

import TableOfVsDA from '@/app/vs-da/table-of-vsda'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { fetcher } from '@/hooks/fetcher'

const VsDAPages = () => {
    const TIMEZONE = 'Asia/Jakarta'
    const STORAGE_KEY_START = 'vsda-start-date'
    const STORAGE_KEY_END = 'vsda-end-date'

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const startStr = localStorage.getItem(STORAGE_KEY_START)
        const endStr = localStorage.getItem(STORAGE_KEY_END)

        const from = startStr ? new Date(startStr) : new Date('2025-06-23')
        const to = endStr ? new Date(endStr) : new Date('2025-06-28')

        return { from, to }
    })

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            localStorage.setItem(
                STORAGE_KEY_START,
                dateRange.from.toISOString()
            )
            localStorage.setItem(STORAGE_KEY_END, dateRange.to.toISOString())
        }
    }, [dateRange])

    const startDate = dateRange?.from
    const endDate = dateRange?.to

    const formattedStartDate = startDate
        ? formatInTimeZone(startDate, TIMEZONE, 'dd/M/yy')
        : ''
    const formattedEndDate = endDate
        ? formatInTimeZone(endDate, TIMEZONE, 'dd/M/yy')
        : ''

    const { data, error, isLoading, mutate } = useSWR(
        startDate && endDate
            ? [
                  `${process.env.NEXT_PUBLIC_API_URL}/api/vsda`,
                  formattedStartDate,
                  formattedEndDate
              ]
            : null,
        fetcher
    )

    const handleFetchData = () => {
        mutate()
    }

    return (
        <>
            {isLoading && <FullScreenLoader />}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Dashboard VS DA</h1>
                <TableOfVsDA
                    data={data || []}
                    onSuccess={handleFetchData}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </>
    )
}

export default VsDAPages
