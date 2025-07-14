'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { DateRange } from 'react-day-picker'
import { formatInTimeZone } from 'date-fns-tz'

import TableOfVsDA from '@/app/vs-da/table-of-vsda'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { fetcher } from '@/hooks/fetcher'
import { useVSDAData } from '@/hooks/useVsDAData'

const VsDAPages = () => {
    const { data, isLoading, dateRange, setDateRange, handleFetchData } =
        useVSDAData()

    console.log('data', data)

    return (
        <>
            {isLoading && <FullScreenLoader />}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Dashboard VS DA</h1>
                {dateRange && (
                    <TableOfVsDA
                        data={data || []}
                        onSuccess={handleFetchData}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                    />
                )}
            </div>
        </>
    )
}

export default VsDAPages
