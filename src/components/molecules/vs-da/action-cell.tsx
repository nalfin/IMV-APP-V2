'use client'

import { Button } from '@/components/atoms/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/atoms/dropdown-menu'
import { VsDATableType } from '@/types/vsda.type'
import { MoreHorizontal } from 'lucide-react'

interface ActionCellProps {
    vsda: VsDATableType
    onEdit: (vsda: VsDATableType) => void
}

export function ActionCellVsDA({ vsda, onEdit }: ActionCellProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        navigator.clipboard.writeText(vsda.member_name)
                    }
                >
                    Copy Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(vsda)}>
                    Edit Poin DA
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
