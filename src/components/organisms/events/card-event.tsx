import CardEventSingle from '@/components/molecules/events/card-event'

const CardEvent = ({ summary }: { summary: any }) => {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-4 lg:grid-rows-1">
            <CardEventSingle
                title="Jumlah Peserta"
                content={summary?.total ?? 0}
                className="col-span-2 lg:col-span-1"
            />
            <CardEventSingle
                title="Jumlah HQ Tercapai (27)"
                content={summary?.totalHQ27 ?? 0}
                className="col-span-2 lg:col-span-1"
            />
            <CardEventSingle
                title="Jumlah Qualified"
                content={summary?.qualified ?? 0}
                className="col-span-2 lg:col-span-1"
            />
            <CardEventSingle
                title="Jumlah Unqualified"
                content={summary?.unqualified ?? 0}
                className="col-span-2 lg:col-span-1"
            />
        </div>
    )
}

export default CardEvent
