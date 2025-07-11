import { ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react'

type CardSingleProps = {
    title: string
    content: string
    change?: number // optional
    subtitle?: string
}

const CardMemberSummarySingle = ({
    title,
    content,
    change,
    subtitle
}: CardSingleProps) => {
    const isPositive = (change ?? 0) >= 0
    // const Icon = isPositive ? TrendingUp : TrendingDown
    const Icon =
        (change ?? 0) > 0
            ? TrendingUp
            : (change ?? 0) < 0
              ? TrendingDown
              : ArrowRightLeft
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500'

    return (
        <>
            <div className="flex flex-col gap-4 rounded-md border bg-card/50 p-6 text-card-foreground shadow-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        {change !== undefined && (
                            <span
                                className={`flex items-center gap-1 text-sm ${changeColor} rounded-sm border border-border px-2 py-1`}
                            >
                                <Icon className="h-4 w-4" />
                                {Math.abs(change)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-semibold">
                        {content}
                    </div>
                </div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </div>
        </>
    )
}

export default CardMemberSummarySingle
