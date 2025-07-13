'use client'

import { Button } from '@/components/atoms/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/atoms/checkbox'
import { MemberTableType } from '@/types/member.type'
import { ActionCellMember } from '@/components/molecules/members/action-cell'

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

function renderHQColumn(): ColumnDef<MemberTableType> {
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
        size: 20,
        minSize: 20,
        maxSize: 80
    }
}

export const getMemberColumns = (
    role: string, // Role diterima sebagai parameter pertama
    onEdit: (member: MemberTableType) => void,
    handleDelete: (id: string) => Promise<void>
): ColumnDef<MemberTableType>[] => {
    // Definisikan kolom dasar
    const baseColumns: ColumnDef<MemberTableType>[] = [
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
            size: 40,
            minSize: 40,
            maxSize: 40,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'member_name',
            header: 'Member Name'
        },
        renderHQColumn(),
        {
            accessorKey: 'role',
            header: () => <div className="text-center">Role</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('role')}</div>
            )
        },
        {
            accessorKey: 'trop',
            header: () => <div className="text-center">Trop</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.getValue('trop')}</div>
            )
        },
        {
            accessorKey: 'status',
            header: () => <div className="text-center">Status</div>,

            cell: ({ row }) => {
                const status = row.getValue<'ACTIVE' | 'INACTIVE'>('status')
                return (
                    <div className="text-center">
                        <span
                            className={`inline-block w-20 rounded py-1 text-center text-xs font-semibold text-white ${
                                status === 'ACTIVE'
                                    ? 'bg-green-600'
                                    : 'bg-red-600'
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                )
            }
        }
    ]

    // Tambahkan kolom 'actions' hanya jika role adalah 'admin'
    if (role === 'admin') {
        baseColumns.push({
            id: 'actions',
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => (
                <ActionCellMember
                    member={row.original}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                />
            )
        })
    }

    return baseColumns
}
