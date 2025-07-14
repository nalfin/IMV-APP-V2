'use client'

import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from './fetcher'
import { formatInTimeZone } from 'date-fns-tz'
import { EventOptionType } from '@/types/event.type'

export function useEventData() {
    const TIMEZONE = 'Asia/Jakarta'
    const STORAGE_KEY_START = 'event-start-date'
    const STORAGE_KEY_END = 'event-end-date'

    const [dateRange, setDateRange] = useState<DateRange>()
    const [eventName, setEventName] = useState('')

    // Format tanggal sesuai header sheet: 'd/M/yy' tanpa leading zero
    const formatForSheetHeader = (date: Date) =>
        formatInTimeZone(date, TIMEZONE, 'd/M/yy')

    useEffect(() => {
        const startStr = localStorage.getItem(STORAGE_KEY_START)
        const endStr = localStorage.getItem(STORAGE_KEY_END)

        const from = startStr ? new Date(startStr) : new Date('2025-06-23')
        const to = endStr ? new Date(endStr) : new Date('2025-06-28')

        setDateRange({ from, to })
    }, [])

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            localStorage.setItem(
                STORAGE_KEY_START,
                dateRange.from.toISOString()
            )
            localStorage.setItem(STORAGE_KEY_END, dateRange.to.toISOString())
        }
    }, [dateRange])

    const formattedStartDate = dateRange?.from
        ? formatForSheetHeader(dateRange.from)
        : ''
    const formattedEndDate = dateRange?.to
        ? formatForSheetHeader(dateRange.to)
        : ''

    console.log({ formattedStartDate, formattedEndDate, eventName })

    const { data: session } = useSession()
    const role = (session?.user as { role?: string })?.role || ''

    const {
        data: eventOptions,
        error: eventOptionsError,
        isLoading: isLoadingEventOptions,
        mutate: mutateEventOptions
    } = useSWR<EventOptionType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/event-list`,
        fetcher
    )

    const {
        data: vsdaEventRes,
        error: vsdaEventError,
        isLoading: isLoadingVsdaEvent,
        mutate: mutateVsdaEvent
    } = useSWR(
        dateRange?.from && dateRange?.to && eventName
            ? [
                  'vsda-event-data',
                  formattedStartDate,
                  formattedEndDate,
                  eventName
              ]
            : null,
        () =>
            fetcher(
                `${process.env.NEXT_PUBLIC_API_URL}/api/events?from=${formattedStartDate}&to=${formattedEndDate}&event=${encodeURIComponent(
                    eventName
                )}`
            )
    )

    const vsdaEventData = vsdaEventRes?.data ?? []

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
