import { EventTableType } from '@/types/event.type'

export function getEventSummary(data: EventTableType[]) {
    const total = data.length
    const totalHQ27 = data.filter((d) => d.hq === 27).length

    let qualified = 0
    let unqualified = 0

    data.forEach((item) => {
        const lowPointCount = item.data_point_da.filter((d) => {
            const match = d.value?.match(/\d+/)
            const value = match ? parseInt(match[0], 10) : null
            return value !== null && value < 7
        }).length

        const isHQ27 = item.hq === 27
        const status =
            lowPointCount > 4
                ? 'UNQUALIFIED'
                : isHQ27
                  ? 'QUALIFIED'
                  : 'ON PROGRESS...'

        if (status === 'QUALIFIED') qualified++
        if (status === 'UNQUALIFIED') unqualified++
    })

    return {
        total,
        totalHQ27,
        qualified,
        unqualified
    }
}
