export type EventOptionType = {
    label: string
    value: string
}

export type PoinVsDAType = {
    date: string
    value: string
}

export type EventTableType = {
    id: string
    member_name: string
    hq: number
    data_point_da: PoinVsDAType[]
}
