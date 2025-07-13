'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/atoms/input'
import { Button } from '@/components/atoms/button'
import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'
import { MemberTableType } from '@/types/member.type'
import { DialogAddMember } from '@/components/organisms/members/dialog-add'
import { useSession } from 'next-auth/react'
// import { DialogAddMember } from '@/app/member/dialog-add' // Path ini mungkin perlu disesuaikan jika DialogAddMember juga dipindahkan
// import { Member } from '@/types/member'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    selectedRows: TData[]
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    onBulkEditOpen: (selected: MemberTableType[]) => void
    onSuccess: () => void
}

export function DataTableToolbarMember<TData extends MemberTableType>({
    table,
    selectedRows,
    onSuccess,
    showFromLast,
    setShowFromLast,
    onBulkEditOpen
}: DataTableToolbarProps<TData>) {
    const { data: session } = useSession()
    const role = (session?.user as { role: string })?.role ?? 'unknown'
    return (
        <div className="x flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
            {/* Search Input and Bulk Edit Button */}
            <div className="flex w-full items-center gap-6 md:max-w-md md:gap-4">
                <Input
                    className="w-full"
                    placeholder="Search by name..."
                    value={
                        (table
                            .getColumn('member_name')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('member_name')
                            ?.setFilterValue(event.target.value)
                    }
                />
                {role === 'admin' && (
                    <Button
                        variant="outline"
                        size="default"
                        className="rounded-sm"
                        onClick={() => onBulkEditOpen(selectedRows)}
                        disabled={selectedRows.length === 0}
                    >
                        Edit Selected
                    </Button>
                )}
            </div>

            {/* Show From Last Checkbox and Add Member Dialog */}
            <div className="flex justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="showLast"
                        checked={showFromLast}
                        onCheckedChange={(checked) =>
                            setShowFromLast(!!checked)
                        }
                    />
                    <Label htmlFor="showLast">Show From Last</Label>
                </div>
                {role === 'admin' && <DialogAddMember onSuccess={onSuccess} />}
            </div>
        </div>
    )
}
