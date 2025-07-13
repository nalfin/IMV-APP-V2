import { parse, format, startOfDay, endOfDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Asia/Jakarta'

export function parseCustomDate(dateStr: string): Date | null {
    if (!dateStr) return null

    // Coba parse format ISO seperti "2025-07-02"
    const parsedISO = new Date(dateStr)
    if (!isNaN(parsedISO.getTime())) {
        return startOfDay(toZonedTime(parsedISO, TIMEZONE))
    }

    // Coba parse format "d/M/yy"
    const parts = dateStr.split('/')
    if (parts.length === 3) {
        const [day, month, yearRaw] = parts.map(Number)
        if (!day || !month || !yearRaw) return null

        const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw
        const parsed = new Date(year, month - 1, day)
        if (!isNaN(parsed.getTime())) {
            return startOfDay(toZonedTime(parsed, TIMEZONE))
        }
    }

    return null
}

export function parseCustomEndDate(dateStr: string): Date | null {
    const parsed = parseCustomDate(dateStr)
    return parsed ? endOfDay(parsed) : null
}

export function formatDateToISO(date: Date): string {
    return format(date, 'yyyy-MM-dd')
}

export function formatToSheetDate(date: Date): string {
    return format(date, 'd/M/yy')
}
