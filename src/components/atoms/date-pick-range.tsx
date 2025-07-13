'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/atoms/button'
import { Calendar } from '@/components/atoms/calendar'
import { Input } from '@/components/atoms/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/atoms/popover'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Fungsi pembantu untuk memformat rentang tanggal untuk tampilan
function formatRange(range: DateRange | undefined): string {
    if (!range?.from) {
        return ''
    }

    // Format kustom: 'dd MMMM yyyy'
    // dd: tanggal dua digit (misal: 01, 23)
    // MMMM: nama bulan lengkap (misal: Januari, Juni)
    // yyyy: tahun empat digit (misal: 2025)
    // `{ locale: id }`: Memastikan nama bulan dalam bahasa Indonesia

    const formattedFrom = format(range.from, 'dd MMM yyyy', { locale: id })

    if (range.to) {
        const formattedTo = format(range.to, 'dd MMM yyyy', { locale: id })
        return `${formattedFrom} - ${formattedTo}`
    }
    // Jika hanya tanggal 'from' yang dipilih
    return formattedFrom
}

export function DatePickRange() {
    const [open, setOpen] = useState(false)
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date('2025-06-23'),
        to: new Date('2025-06-28')
    })

    return (
        <>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    // Gunakan dateRange yang diformat untuk nilai input
                    value={formatRange(dateRange)}
                    placeholder="Pilih rentang tanggal"
                    className="w-[280px] bg-background pr-10"
                    // `onChange` dan `onKeyDown` untuk input kurang relevan
                    // ketika interaksi utama melalui popover kalender.
                    // Anda dapat menghapusnya atau menyesuaikannya untuk parsing input manual.
                    onChange={() => {
                        /* Tangani parsing input manual jika diinginkan */
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Pilih tanggal</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={(range) => {
                                setDateRange(range)
                                // Tutup popover setelah rentang dipilih (tanggal awal dan akhir)
                                if (range?.from && range?.to) {
                                    setOpen(false)
                                }
                            }}
                            className="rounded-lg border shadow-sm"
                            numberOfMonths={2} // Seringkali berguna untuk rentang tanggal
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}
