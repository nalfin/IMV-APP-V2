'use client'

import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from './fetcher'
import { EventOptionType } from '@/types/event.type'
import { formatInTimeZone } from 'date-fns-tz'

export function useEventData() {
    const TIMEZONE = 'Asia/Jakarta'
    const STORAGE_KEY_START = 'event-start-date'
    const STORAGE_KEY_END = 'event-end-date'

    const [eventName, setEventName] = useState('')
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [hasMounted, setHasMounted] = useState(false)

    // Ambil tanggal dari localStorage saat mount (client-only)
    useEffect(() => {
        setHasMounted(true)

        if (typeof window === 'undefined') return

        const startStr = localStorage.getItem(STORAGE_KEY_START)
        const endStr = localStorage.getItem(STORAGE_KEY_END)

        const from = startStr ? new Date(startStr) : new Date('2025-06-23')
        const to = endStr ? new Date(endStr) : new Date('2025-06-28')

        setDateRange({ from, to })
    }, [])

    // Simpan tanggal ke localStorage saat berubah
    useEffect(() => {
        if (typeof window !== 'undefined' && dateRange?.from && dateRange?.to) {
            localStorage.setItem(
                STORAGE_KEY_START,
                dateRange.from.toISOString()
            )
            localStorage.setItem(STORAGE_KEY_END, dateRange.to.toISOString())
        }
    }, [dateRange])

    const { data: session } = useSession()
    const role = (session?.user as { role?: string })?.role || ''

    const startDate = dateRange?.from
    const endDate = dateRange?.to

    const formattedStartDate = startDate
        ? formatInTimeZone(startDate, TIMEZONE, 'dd/M/yy')
        : ''
    const formattedEndDate = endDate
        ? formatInTimeZone(endDate, TIMEZONE, 'dd/M/yy')
        : ''

    // Ambil daftar event
    const {
        data: eventOptions,
        error: eventOptionsError,
        isLoading: isLoadingEventOptions,
        mutate: mutateEventOptions
    } = useSWR<EventOptionType[]>(
        hasMounted
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/event-list`
            : null,
        fetcher
    )

    // Ambil data vsda event berdasarkan nama + tanggal
    const {
        data: vsdaEventData,
        error: vsdaEventError,
        isLoading: isLoadingVsdaEvent,
        mutate: mutateVsdaEvent
    } = useSWR(
        hasMounted && startDate && endDate && eventName
            ? [
                  `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
                  formattedStartDate,
                  formattedEndDate,
                  eventName
              ]
            : null,
        fetcher
    )

    return {
        eventName,
        setEventName,
        dateRange,
        setDateRange,
        eventOptions,
        eventOptionsError,
        isLoadingEventOptions,
        handleFetchEventList: mutateEventOptions,
        vsdaEventData,
        vsdaEventError,
        isLoadingVsdaEvent,
        handleFetchVsDAEvent: mutateVsdaEvent,
        session,
        role
    }
}
