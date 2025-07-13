// Format tanggal ke yyyy-MM-dd
export function formatToYYYYMMDD(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// Normalize waktu jadi jam 00:00
export function normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Ambil array tanggal antara start–end, kecuali Minggu
export function getDateRangeWithoutSunday(start: Date, end: Date): Date[] {
    const dates: Date[] = []
    const current = new Date(start)
    while (current <= end) {
        if (current.getDay() !== 0) {
            dates.push(new Date(current))
        }
        current.setDate(current.getDate() + 1)
    }
    return dates
}

// Map hari ke label D1–D6
export function getDLabelFromDay(day: number): string {
    const map: Record<number, string> = {
        1: 'D1', // Senin
        2: 'D2',
        3: 'D3',
        4: 'D4',
        5: 'D5',
        6: 'D6'
    }
    return map[day] ?? '-'
}

// Format header: D1 (Senin, 23/6)
export function formatHeaderWithDate(date: Date): string {
    const days = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu'
    ]
    const hari = days[date.getDay()]
    const day = date.getDate()
    const month = date.getMonth() + 1
    const dLabel = getDLabelFromDay(date.getDay())
    return `${dLabel} (${day}/${month})`
    // return `${dLabel} (${hari}, ${day}/${month})`
}
