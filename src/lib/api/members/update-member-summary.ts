import { getSheetsClient } from '@/lib/utils/sheet-client'
import { google } from 'googleapis' // Pastikan google diimpor jika diperlukan oleh sheet-client

interface MemberSummary {
    total: number
    upLevel: number
    midLevel: number
    downLevel: number
    activeCount: number
    inactiveCount: number
}

/**
 * Menambahkan baris ringkasan member baru ke sheet DB_MEMBER_SUMMARY.
 * Asumsi struktur DB_MEMBER_SUMMARY:
 * A=TIME_STAMP, B=TOTAL, C=UP_LEVEL, D=MID_LEVEL, E=DOWN_LEVEL, F=ACTIVE_COUNT, G=INACTIVE_COUNT.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @param summary Objek ringkasan member yang akan ditambahkan.
 * @returns Objek { success: boolean, message: string }
 */
export async function updateMemberSummaryInDb(
    spreadsheetId: string,
    summary: MemberSummary
) {
    const sheets = await getSheetsClient()
    const summarySheetName = 'DB_MEMBER_SUMMARY'

    try {
        const now = new Date().toISOString() // Timestamp saat ini

        // Baris data baru yang akan ditambahkan ke summary sheet
        const newSummaryRow = [
            now, // Kolom A: TIME_STAMP
            summary.total, // Kolom B: TOTAL
            summary.upLevel, // Kolom C: UP_LEVEL
            summary.midLevel, // Kolom D: MID_LEVEL
            summary.downLevel, // Kolom E: DOWN_LEVEL
            summary.activeCount, // Kolom F: ACTIVE_COUNT
            summary.inactiveCount // Kolom G: INACTIVE_COUNT
        ]

        // Menambahkan baris baru ke Google Sheet DB_MEMBER_SUMMARY
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: summarySheetName, // Range target untuk penambahan data
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [newSummaryRow]
            }
        })

        return {
            success: true,
            message: 'Member summary updated successfully.'
        }
    } catch (err: any) {
        console.error(
            'Error updating member summary in DB_MEMBER_SUMMARY:',
            err
        )
        return {
            success: false,
            message:
                'Internal Server Error during DB_MEMBER_SUMMARY update: ' +
                (err.message || 'Unknown error')
        }
    }
}
