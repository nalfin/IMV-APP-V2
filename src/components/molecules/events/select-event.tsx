'use client'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/atoms/select'
import { fetcher } from '@/hooks/fetcher'
import { EventOptionType } from '@/types/event.type'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

// Definisikan tipe untuk item event yang diterima dari API

interface Props {
    eventName: string | null
    setEventName: (val: string) => void
    data: EventOptionType[]
    isLoading: boolean
    error: any
}

export function SelectEvent({
    eventName,
    setEventName,
    data,
    isLoading,
    error
}: Props) {
    // Pastikan data selalu berupa array, bahkan jika undefined saat loading/error
    const eventListOptions = useMemo(() => data || [], [data])

    // Auto pilih event pertama kalau belum ada, atau dari localStorage
    useEffect(() => {
        const storedEventName = localStorage.getItem('eventName')

        if (storedEventName) {
            setEventName(storedEventName)
        } else if (!eventName && eventListOptions.length > 0) {
            setEventName(eventListOptions[0].value)
            localStorage.setItem('eventName', eventListOptions[0].value)
        }
    }, [eventListOptions, eventName, setEventName])

    const handleChange = (value: string) => {
        setEventName(value)
        localStorage.setItem('eventName', value)
    }

    // Tentukan placeholder dinamis (tetap berguna untuk SelectValue saat aktif)
    const dynamicPlaceholder = useMemo(() => {
        if (isLoading) {
            return 'Loading events...'
        }
        if (error) {
            return 'Failed to load events.'
        }
        if (eventListOptions.length === 0) {
            return 'No events available.'
        }
        return 'Select EVENT'
    }, [isLoading, error, eventListOptions.length])

    return (
        <Select
            value={eventName ?? undefined}
            onValueChange={handleChange}
            name="event"
            // Disable select jika sedang loading atau ada error atau tidak ada event
            disabled={isLoading || !!error || eventListOptions.length === 0}
        >
            <SelectTrigger className="w-[180px]">
                {/*
                    Kondisional: Jika sedang loading, error, atau tidak ada event,
                    tampilkan teks status langsung sebagai child dari SelectTrigger.
                    Jika tidak, gunakan SelectValue seperti biasa untuk menampilkan nilai terpilih
                    atau placeholder default.
                */}
                {isLoading ? (
                    <div className="flex items-center text-muted-foreground">
                        {/* <LoadingSpinner className="mr-2" /> */}
                        <span className="loading-dots">Loading</span>
                    </div>
                ) : error ? (
                    <span className="text-red-500">{dynamicPlaceholder}</span>
                ) : eventListOptions.length === 0 ? (
                    <span className="text-muted-foreground">
                        {dynamicPlaceholder}
                    </span>
                ) : (
                    // Jika ada data, biarkan SelectValue menangani tampilan nilai atau placeholder
                    <SelectValue placeholder={dynamicPlaceholder} />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {/* Kondisi loading, error, atau no data ditampilkan di dalam SelectGroup */}
                    {isLoading ? (
                        <SelectItem value="loading" disabled>
                            <div className="flex items-center">
                                {/* <LoadingSpinner className="mr-2" /> */}
                                <span className="loading-dots">Loading</span>
                            </div>
                        </SelectItem>
                    ) : error ? (
                        <SelectItem
                            value="error"
                            disabled
                            className="text-red-500"
                        >
                            Failed to load events.
                        </SelectItem>
                    ) : eventListOptions.length === 0 ? (
                        <SelectItem value="no-events" disabled>
                            No events available.
                        </SelectItem>
                    ) : (
                        /* Menggunakan eventListOptions (data dari SWR) dan properti value/label */
                        eventListOptions.map((event, i) => (
                            <SelectItem
                                key={event.value || i}
                                value={event.value}
                            >
                                {event.label}
                            </SelectItem>
                        ))
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
