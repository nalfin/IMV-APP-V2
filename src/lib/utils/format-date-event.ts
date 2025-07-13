import { parse } from 'date-fns'

export function parseCustomDateEvent(dateStr: string): Date | null {
    const formats = ['d/M/yy', 'dd/M/yy', 'd/MM/yy', 'dd/MM/yy']
    for (const formatStr of formats) {
        const parsed = parse(dateStr, formatStr, new Date())
        if (!isNaN(parsed.getTime())) return parsed
    }
    return null
}
