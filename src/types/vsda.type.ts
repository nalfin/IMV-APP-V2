export type PoinVsDAType = {
    date: string
    value: string
}
export type VsDATableType = {
    id: string
    member_name: string
    hq: number
    data_point_da: PoinVsDAType[]
}
