'use client'

import * as React from 'react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/components/atoms/calendar'

interface Calendar04Props {
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function Calendar04({ dateRange, setDateRange }: Calendar04Props) {
    return (
        <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-lg border shadow-sm"
        />
    )
}
