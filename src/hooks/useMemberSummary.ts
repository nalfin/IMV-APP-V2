import { fetcher } from '@/hooks/fetcher'
import { processSummaryByWeek } from '@/lib/utils/process-summary-by-week'
import useSWR from 'swr'
import { SummaryWithChange } from '@/types/member.type'

export function useMemberSummary(): {
    summary: SummaryWithChange | null
    isLoadingSummary: boolean
    isErrorSummary: any
    handleUpdateSummary: () => void
} {
    const { data, mutate, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/summary`,
        fetcher
    )

    const dataSummary = data || []

    const fixedData = dataSummary.map((item: any) => ({
        timestamp: item.time_stamp,
        total: item.total,
        'HQ ≥ 27': item.upLevel,
        'HQ 24-26': item.midLevel,
        'HQ < 24': item.downLevel
    }))

    const summary = processSummaryByWeek(fixedData) ?? null

    return {
        summary,
        isLoadingSummary: isLoading,
        isErrorSummary: error,
        handleUpdateSummary: () => mutate()
    }
}
