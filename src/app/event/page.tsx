'use client'

import TableOfEvent from '@/app/event/table-of-event'
import { SelectEvent } from '@/components/molecules/events/select-event'
import CardEvent from '@/components/organisms/events/card-event'
import { DialogAddEvents } from '@/components/organisms/events/dialog-add'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { useEventData } from '@/hooks/useEventData'
import { getEventSummary } from '@/lib/utils/summary-event'
import { useSession } from 'next-auth/react'

const EventPages = () => {
    const {
        eventName,
        setEventName,
        dateRange,
        setDateRange,
        eventOptions,
        isLoadingEventOptions,
        eventOptionsError,
        handleFetchEventList,
        vsdaEventData,
        isLoadingVsdaEvent,
        handleFetchVsDAEvent
    } = useEventData()

    const summary = getEventSummary(vsdaEventData || [])

    const { data: session } = useSession()
    const role = (session?.user as { role?: string })?.role || ''

    return (
        <>
            {isLoadingVsdaEvent && <FullScreenLoader />}
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Event</h1>
                <div className="flex w-full justify-between">
                    <SelectEvent
                        eventName={eventName}
                        setEventName={setEventName}
                        data={eventOptions || []}
                        isLoading={isLoadingEventOptions}
                        error={eventOptionsError}
                    />
                    {role === 'admin' && (
                        <DialogAddEvents onSuccess={handleFetchEventList} />
                    )}
                </div>

                {/* CardEvent bisa pakai summary kalau nanti perlu */}
                <CardEvent summary={summary} />

                <TableOfEvent
                    data={vsdaEventData || []}
                    onSuccess={handleFetchVsDAEvent}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </>
    )
}

export default EventPages
