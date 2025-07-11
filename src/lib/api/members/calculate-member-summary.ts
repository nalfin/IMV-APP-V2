import { getSheetsClient } from '@/lib/sheets/init'
import { google } from 'googleapis' // Pastikan google diimpor jika diperlukan oleh sheet-client

/**
 * Menghitung ringkasan member dari sheet DB_MEMBERS.
 * Asumsi struktur DB_MEMBERS: A=ID, B=MEMBER_NAME, C=HQ, D=ROLE, E=TROP, F=STATUS, G=TIME_STAMP.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @returns Objek ringkasan member.
 */
export async function calculateMemberSummary(spreadsheetId: string) {
    const sheets = await getSheetsClient()
    const memberSheetName = 'DB_MEMBERS'

    try {
        // Membaca semua data dari DB_MEMBERS
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${memberSheetName}!A:G` // Membaca semua kolom yang relevan
        })

        const rows = readRes.data.values || []
        // Lewati baris header (indeks 0)
        const dataRows = rows.slice(1)

        let total = 0
        let upLevel = 0 // HQ >= 27
        let midLevel = 0 // HQ >= 24 (tapi < 27)
        let downLevel = 0 // HQ < 24
        let activeCount = 0
        let inactiveCount = 0

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i]
            const id = String(row[0] || '').trim()
            const hqRaw = row[2] // Kolom C adalah HQ
            const statusRaw = row[5] // Kolom F adalah STATUS

            // Validasi dasar
            if (!id || hqRaw === '' || hqRaw == null) continue

            const hq = Number(hqRaw)
            if (isNaN(hq)) continue

            total++

            const status = String(statusRaw || '').toUpperCase()
            if (status === 'ACTIVE') activeCount++
            else if (status === 'INACTIVE') inactiveCount++

            if (hq >= 27) upLevel++
            else if (hq >= 24) midLevel++
            else downLevel++
        }

        return {
            total,
            upLevel,
            midLevel,
            downLevel,
            activeCount,
            inactiveCount
        }
    } catch (err: any) {
        console.error('Error calculating member summary:', err)
        // Kembalikan nilai default jika ada error
        return {
            total: 0,
            upLevel: 0,
            midLevel: 0,
            downLevel: 0,
            activeCount: 0,
            inactiveCount: 0
        }
    }
}
