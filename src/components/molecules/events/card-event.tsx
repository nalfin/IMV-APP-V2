import { cn } from '@/lib/utils'

const CardEventSingle = ({
    title,
    content,
    className
}: {
    title: string
    content: string
    className?: string
}) => {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 rounded-md border bg-card p-6 text-card-foreground shadow-sm',
                className
            )}
        >
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold">{content}</p>
        </div>
    )
}

export default CardEventSingle
