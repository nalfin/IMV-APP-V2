export type MemberTableType = {
    id: string
    member_name: string
    hq: number
    role: string
    trop: string
    status: string
    time_stamp: string
}

export type SummaryWithChange = {
    total: { value: number; change: number }
    up: { value: number; change: number }
    mid: { value: number; change: number }
    down: { value: number; change: number }
}
