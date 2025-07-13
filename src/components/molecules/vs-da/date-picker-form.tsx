'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/atoms/button'
import { Calendar } from '@/components/atoms/calendar'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/atoms/popover'

function formatDate(date: Date | undefined) {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime())
}

// 🔁 Fungsi untuk konversi hari ke D1-D6
function getDLabel(date: Date | undefined): string {
    if (!date) return ''
    const day = date.getDay() // Minggu = 0, Senin = 1, ..., Sabtu = 6
    const dayMap: Record<number, string> = {
        1: 'D1', // Senin
        2: 'D2',
        3: 'D3',
        4: 'D4',
        5: 'D5',
        6: 'D6'
    }
    return dayMap[day] ?? '' // Minggu tidak ditampilkan
}

export function DatePickerForm({
    value,
    onChange
}: {
    value?: Date
    onChange: (date: Date | undefined) => void
}) {
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date | undefined>(value)
    const [valueStr, setValueStr] = React.useState(formatDate(value))

    const dLabel = getDLabel(value)

    return (
        <div className="flex flex-col gap-3">
            <div className="flex w-full justify-between">
                <Label htmlFor="date" className="px-1">
                    Tanggal VS DA
                </Label>
                {/* ✅ Label dinamis */}
                {dLabel && (
                    <p className="rounded bg-secondary/50 px-3 py-1 text-sm font-medium">
                        {dLabel}
                    </p>
                )}
            </div>
            <div className="relative col-span-3 flex gap-2">
                <Input
                    id="date"
                    value={valueStr}
                    placeholder="June 01, 2025"
                    onChange={(e) => {
                        const inputDate = new Date(e.target.value)
                        setValueStr(e.target.value)
                        if (isValidDate(inputDate)) {
                            onChange(inputDate)
                            setMonth(inputDate)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                    className="bg-background pr-10 text-sm font-medium"
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                                onChange(date)
                                setValueStr(formatDate(date))
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
