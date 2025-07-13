import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import { VsDATableType } from '@/types/vsda.type'
import { ActionCellVsDA } from '@/components/molecules/vs-da/action-cell'
import {
    formatHeaderWithDate,
    formatToYYYYMMDD,
    getDateRangeWithoutSunday,
    getDLabelFromDay,
    normalizeDate
} from '@/lib/utils/columns-vsda'

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

function renderHQColumn(): ColumnDef<VsDATableType> {
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

// Fungsi utama generate kolom dinamis
export const getVsDAColumns = (
    role: string,
    onEdit: (vsdaData: VsDATableType) => void,
    startDate: Date | null,
    endDate: Date | null,
    showDateHeader: boolean
): ColumnDef<VsDATableType>[] => {
    if (!startDate || !endDate) return []

    const normalizedStart = normalizeDate(startDate)
    const normalizedEnd = normalizeDate(endDate)
    const dateObjects = getDateRangeWithoutSunday(
        normalizedStart,
        normalizedEnd
    )
    const dateKeys = dateObjects.map(formatToYYYYMMDD)

    const baseColumns: ColumnDef<VsDATableType>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40
        },
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
                cell: ({ row }: { row: { original: VsDATableType } }) => {
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
        }
    ]

    // Kolom actions khusus admin
    if (role === 'admin') {
        baseColumns.push({
            id: 'actions',
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => (
                <ActionCellVsDA vsda={row.original} onEdit={onEdit} />
            )
        })
    }

    return baseColumns
}
