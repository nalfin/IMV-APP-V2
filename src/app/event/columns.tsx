'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { EventTableType } from '@/types/event.type'
import {
    formatHeaderWithDate,
    formatToYYYYMMDD,
    getDateRangeWithoutSunday,
    getDLabelFromDay,
    normalizeDate
} from '@/lib/utils/columns-vsda-event'

// Tombol sorting di header
function sortingHeader(label: string, column: any) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

function renderHQColumn(): ColumnDef<EventTableType> {
    return {
        accessorKey: 'hq',
        header: ({ column }) => (
            <div className="text-center">{sortingHeader('HQ', column)}</div>
        ),
        cell: ({ row }) => {
            const hq = row.getValue<number>('hq')
            const bg =
                hq >= 27
                    ? 'bg-transparent border border-green-600 text-white'
                    : ''
            return (
                <div className={`rounded px-2 py-1 text-center ${bg}`}>
                    {hq}
                </div>
            )
        },
        size: 100,
        minSize: 100,
        maxSize: 100
    }
}

export function getEventColumns(
    startDate: Date,
    endDate: Date,
    showDateHeader: boolean
): ColumnDef<EventTableType>[] {
    if (!startDate || !endDate) return []

    const normalizedStart = normalizeDate(startDate)
    const normalizedEnd = normalizeDate(endDate)
    const dateObjects = getDateRangeWithoutSunday(
        normalizedStart,
        normalizedEnd
    )
    const dateKeys = dateObjects.map(formatToYYYYMMDD)

    const baseColumns: ColumnDef<EventTableType>[] = [
        {
            accessorKey: 'member_name',
            header: ({ column }) => sortingHeader('Member Name', column),
            cell: ({ row }) => (
                <div className="ml-4">{row.getValue('member_name')}</div>
            )
        },
        renderHQColumn(),

        // Kolom tanggal dinamis D1–D6
        ...dateObjects.map((dateObj) => {
            const dateStr = formatToYYYYMMDD(dateObj)
            return {
                id: `date-${dateStr}`,
                header: () => (
                    <div className="text-center">
                        {showDateHeader
                            ? formatHeaderWithDate(dateObj)
                            : getDLabelFromDay(dateObj.getDay())}
                    </div>
                ),
                cell: ({ row }: { row: { original: EventTableType } }) => {
                    // console.log(row.original.data_point_da)
                    const value = row.original.data_point_da.find(
                        (d) => d.date === dateStr
                    )?.value

                    const match = value?.match(/\d+/)
                    const number = match ? parseInt(match[0], 10) : null

                    const bgColor =
                        number === null
                            ? 'bg-transparent'
                            : number >= 7
                              ? 'bg-green-600'
                              : 'bg-red-700'

                    return (
                        <div
                            className={`${bgColor} w-full rounded px-2 py-1 text-center`}
                        >
                            {value || '-'}
                        </div>
                    )
                },
                size: 80
            }
        }),

        // Kolom persentase
        {
            id: 'percentage',
            // header: ({ column }) => sortingHeader('%', column),
            header: ({ column }) => (
                <div className="text-center">{sortingHeader('%', column)}</div>
            ),
            accessorFn: (row) => {
                const values = row.data_point_da
                    .filter((d) => dateKeys.includes(d.date))
                    .map((d) => {
                        const match = d.value.match(/\d+/)
                        return match ? parseInt(match[0], 10) : 0
                    })

                const total = values.reduce((sum, val) => sum + val, 0)
                const maxTotal = dateKeys.length * 9
                return Math.round((total / maxTotal) * 100)
            },
            cell: ({ getValue }) => {
                const percentage = getValue<number>()
                return (
                    <div className="text-center font-semibold">
                        {percentage}%
                    </div>
                )
            },
            size: 80
        },

        // Kolom hasil
        {
            id: 'result',
            accessorFn: (row) => {
                const hq = row.hq
                const lowPoints = dateKeys.filter((date) => {
                    const match = row.data_point_da.find((d) => d.date === date)
                    const raw = match?.value || ''
                    const num = raw.match(/\d+/)
                    const value = num ? parseInt(num[0], 10) : null
                    return value !== null && value < 7
                })

                const lowCount = lowPoints.length

                if (hq === 27) {
                    return lowCount > 4 ? 'UNQUALIFIED' : 'QUALIFIED'
                } else {
                    return lowCount > 4 ? 'UNQUALIFIED' : 'ON PROGRESS...'
                }
            },
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Hasil
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            sortingFn: (rowA, rowB, columnId) => {
                const order = ['QUALIFIED', 'ON PROGRESS...', 'UNQUALIFIED']
                const a = rowA.getValue<string>(columnId)
                const b = rowB.getValue<string>(columnId)
                return order.indexOf(a) - order.indexOf(b)
            },
            size: 150,
            minSize: 120,
            maxSize: 200,
            cell: ({ getValue }) => {
                const result = getValue<string>()

                const bg =
                    result === 'QUALIFIED'
                        ? 'bg-green-600'
                        : result === 'UNQUALIFIED'
                          ? 'bg-red-600'
                          : 'bg-stone-900'

                const textColor =
                    result === 'QUALIFIED'
                        ? 'text-white'
                        : result === 'UNQUALIFIED'
                          ? 'text-white'
                          : 'text-muted-foreground italic'

                return (
                    <div
                        className={`flex h-[30px] w-full items-center justify-center rounded px-2 text-center font-semibold ${textColor} ${bg}`}
                    >
                        {result}
                    </div>
                )
            }
        }
    ]

    return baseColumns
}
