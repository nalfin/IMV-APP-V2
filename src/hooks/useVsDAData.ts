'use client'

import { useEffect, useState } from 'react'
import { formatInTimeZone } from 'date-fns-tz'
import { DateRange } from 'react-day-picker'
import useSWR from 'swr'
import { fetcher } from './fetcher'

export function useVSDAData(storageKeyPrefix = 'vsda') {
    const TIMEZONE = 'Asia/Jakarta'
    const STORAGE_KEY_START = 'vsda-start-date'
    const STORAGE_KEY_END = 'vsda-end-date'

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

    // ⛑️ Ambil dari localStorage hanya di client
    useEffect(() => {
        const startStr = localStorage.getItem(STORAGE_KEY_START)
        const endStr = localStorage.getItem(STORAGE_KEY_END)
        const from = startStr ? new Date(startStr) : new Date('2025-06-23')
        const to = endStr ? new Date(endStr) : new Date('2025-06-28')
        setDateRange({ from, to })
    }, [])

    // Simpan ke localStorage saat berubah
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

    return {
        dateRange,
        setDateRange,
        data,
        error,
        isLoading,
        mutate,
        formattedStartDate,
        formattedEndDate,
        handleFetchData
    }
}
