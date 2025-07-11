'use client'

import { SelectEvent } from '@/components/molecules/events/select-event'
import { DialogAddEvents } from '@/components/organisms/events/dialog-add'
import { fetcher } from '@/hooks/fetcher'
import { EventOptionType } from '@/types/event.type'
import { useState } from 'react'
import useSWR from 'swr'

const EventPages = () => {
    const [eventName, setEventName] = useState('')

    const { data, error, isLoading, mutate } = useSWR<EventOptionType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        fetcher
    )

    const handleFetchData = () => {
        mutate()
    }

    return (
        <>
            <div className="flex w-full justify-between">
                <SelectEvent
                    eventName={eventName}
                    setEventName={setEventName}
                    data={data || []}
                    isLoading={isLoading}
                    error={error}
                />
                <DialogAddEvents onSuccess={handleFetchData} />
            </div>
        </>
    )
}

export default EventPages
