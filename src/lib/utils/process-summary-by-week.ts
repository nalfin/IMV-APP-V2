import { SummaryWithChange } from '@/types/member.type'
import { parseISO, endOfWeek, isSameWeek } from 'date-fns'

function calculateChange(current: number, previous: number): number {
    return current - previous
}

interface CleanedSummary {
    timestamp: string
    total: number
    'HQ ≥ 27': number
    'HQ 24-26': number
    'HQ < 24': number
}

export function processSummaryByWeek(
    data: CleanedSummary[]
): SummaryWithChange | null {
    if (!data || data.length < 2) return null

    const grouped: Record<string, CleanedSummary> = {}

    data.forEach((item) => {
        const endOfWeekStr = endOfWeek(parseISO(item.timestamp)).toISOString()
        if (
            !grouped[endOfWeekStr] ||
            parseISO(item.timestamp) > parseISO(grouped[endOfWeekStr].timestamp)
        ) {
            grouped[endOfWeekStr] = item
        }
    })

    const sorted = Object.values(grouped).sort(
        (a, b) =>
            parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()
    )

    if (sorted.length < 2) return null

    const current = sorted[0]
    const previous = sorted[1]

    return {
        total: {
            value: current.total,
            change: calculateChange(current.total, previous.total)
        },
        up: {
            value: current['HQ ≥ 27'],
            change: calculateChange(current['HQ ≥ 27'], previous['HQ ≥ 27'])
        },
        mid: {
            value: current['HQ 24-26'],
            change: calculateChange(current['HQ 24-26'], previous['HQ 24-26'])
        },
        down: {
            value: current['HQ < 24'],
            change: calculateChange(current['HQ < 24'], previous['HQ < 24'])
        }
    }
}
