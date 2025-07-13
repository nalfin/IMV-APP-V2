'use client'

import TableOfEvent from '@/app/event/table-of-event'
import TableOfMembers from '@/app/member/table-of-member'
import TableOfVsDA from '@/app/vs-da/table-of-vsda'
import { SelectEvent } from '@/components/molecules/events/select-event'
import CardMemberSummary from '@/components/organisms/members/card-summary'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { useEventData } from '@/hooks/useEventData'
import { useVSDAData } from '@/hooks/useVsDAData'

export default function Home() {
    const {
        dateRange: dateRangeVsDA,
        setDateRange: setDateRangeVsDA,
        data: dataVsDA,
        mutate: handleFetchDataVsDA,
        isLoading: isLoadingVsDA
    } = useVSDAData()

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

    return (
        <>
            {isLoadingVsDA && isLoadingVsdaEvent && <FullScreenLoader />}
            <div className="grid grid-cols-1 gap-6">
                <CardMemberSummary />

                <div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-4">
                    <div className="col-span-2">
                        <div className="flex flex-col gap-6 rounded-xl bg-input/25 p-6">
                            <p>PROGRESS ALL MEMBER</p>
                            <TableOfVsDA
                                data={dataVsDA || []}
                                onSuccess={handleFetchDataVsDA}
                                dateRange={dateRangeVsDA}
                                setDateRange={setDateRangeVsDA}
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex flex-col gap-6 rounded-xl bg-input/25 p-6">
                            <SelectEvent
                                eventName={eventName}
                                setEventName={setEventName}
                                data={eventOptions || []}
                                isLoading={isLoadingEventOptions}
                                error={eventOptionsError}
                            />
                            <TableOfEvent
                                data={vsdaEventData?.data || []}
                                onSuccess={handleFetchVsDAEvent}
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
