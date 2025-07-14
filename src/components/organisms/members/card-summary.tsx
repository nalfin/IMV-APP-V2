import { useEffect } from 'react'
import CardMemberSummarySingle from '@/components/molecules/members/card-summary'
import { useMemberSummary } from '@/hooks/useMemberSummary'
import { SummaryWithChange } from '@/types/member.type'

function getChangeLabel(change: number): string {
    if (change > 0) return `Naik ${change} dibanding minggu lalu`
    if (change < 0) return `Turun ${Math.abs(change)} dibanding minggu lalu`
    return 'Tidak berubah dari minggu lalu'
}

type Props = {
    onExposeUpdate?: (handler: () => void) => void
}

export default function CardMemberSummary({ onExposeUpdate }: Props) {
    const { summary, isLoadingSummary, handleUpdateSummary } =
        useMemberSummary()

    // Kirim update handler ke parent saat siap
    useEffect(() => {
        if (onExposeUpdate) {
            onExposeUpdate(handleUpdateSummary)
        }
    }, [handleUpdateSummary, onExposeUpdate])

    if (!summary) return null

    return (
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            <CardMemberSummarySingle
                title="Jumlah Anggota"
                content={`${summary.total.value}/100`}
                change={summary.total.change}
                subtitle={getChangeLabel(summary.total.change)}
            />
            <CardMemberSummarySingle
                title="Jumlah HQ ≥ 27"
                content={`${summary.up.value}/${summary.total.value}`}
                change={summary.up.change}
                subtitle={getChangeLabel(summary.up.change)}
            />
            <CardMemberSummarySingle
                title="Jumlah HQ 24-26"
                content={`${summary.mid.value}/${summary.total.value}`}
                change={summary.mid.change}
                subtitle={getChangeLabel(summary.mid.change)}
            />
            <CardMemberSummarySingle
                title="Jumlah HQ < 24"
                content={`${summary.down.value}/${summary.total.value}`}
                change={summary.down.change}
                subtitle={getChangeLabel(summary.down.change)}
            />
        </div>
    )
}
