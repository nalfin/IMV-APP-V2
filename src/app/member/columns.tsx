'use client'

import { Button } from '@/components/atoms/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/atoms/checkbox'
import { MemberTableType } from '@/types/member.type'
import { ActionCell } from '@/components/molecules/members/action-cell'

export const getColumns = (
    onEdit: (member: MemberTableType) => void,
    handleDelete: (id: string) => Promise<void>
): ColumnDef<MemberTableType>[] => {
    return [
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
        {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    HQ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            accessorKey: 'hq',
            cell: ({ row }) => <div className="ml-4">{row.getValue('hq')}</div>
        },
        {
            accessorKey: 'role',
            header: 'Role'
        },
        {
            accessorKey: 'trop',
            header: 'Trops'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue<'ACTIVE' | 'INACTIVE'>('status')
                return (
                    <span
                        className={`inline-block w-20 rounded py-1 text-center text-xs font-semibold text-white ${
                            status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {status}
                    </span>
                )
            }
        },
        {
            id: 'actions',
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => (
                <ActionCell
                    member={row.original}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                />
            )
        }
    ]
}
