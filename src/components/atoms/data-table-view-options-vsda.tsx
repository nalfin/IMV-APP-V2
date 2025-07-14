'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

import { Button } from '@/components/atoms/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/atoms/dropdown-menu'

export function DataTableViewOptionsVsDA<TData>({
    table
}: {
    table: Table<TData>
}) {
    const dateColumns = table
        .getAllColumns()
        .filter((col) => col.id.startsWith('date-'))

    const allDateColsVisible = dateColumns.every((col) => col.getIsVisible())

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto flex h-8 lg:flex"
                >
                    <Settings2 className="mr-2 h-4 w-4" />
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="max-h-[400px] w-[200px] overflow-y-auto"
            >
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* ✅ Toggle semua kolom tanggal */}
                <DropdownMenuCheckboxItem
                    className="font-semibold capitalize"
                    checked={allDateColsVisible}
                    onCheckedChange={(value) => {
                        dateColumns.forEach((col) =>
                            col.toggleVisibility(!!value)
                        )
                    }}
                >
                    Toggle Date Columns
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                {/* ✅ Toggle individual */}
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== 'undefined' &&
                            column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
