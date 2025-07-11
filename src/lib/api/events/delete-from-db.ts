import { getSheetsClient } from '@/lib/sheets/init'

/**
 * Menghapus semua entri member dari sheet DB_EVENTS berdasarkan ID member.
 * Asumsi struktur DB_EVENTS: A=ID (member ID), B=MEMBER_NAME, C=HQ, D=EVENT NAME, E=TIME_STAMP.
 * Ini akan menghapus *semua baris yang cocok* dengan ID member yang diberikan.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @param memberId ID member yang akan dihapus.
 * @returns Objek { success: boolean, message: string }
 */
export async function deleteMemberFromDbEvents(
    spreadsheetId: string,
    memberId: string
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_EVENTS'

    try {
        // Membaca hanya kolom A (ID) untuk menemukan baris yang cocok
        // Asumsi data di DB_EVENTS dimulai dari baris 2 (indeks 1 di array)
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`
        })

        const rows = readRes.data.values || []
        // Mengumpulkan semua indeks baris (berbasis 0) dari member yang akan dihapus
        // Dimulai dari indeks 1 (baris 2) karena Apps Script Anda mulai dari A2
        const rowIndexesToDelete: number[] = []
        for (let i = 0; i < rows.length; i++) {
            if (i > 0 && rows[i][0] === memberId) {
                // i > 0 untuk mulai dari baris 2
                rowIndexesToDelete.push(i)
            }
        }

        if (rowIndexesToDelete.length === 0) {
            return {
                success: true,
                message:
                    'No matching entries found in DB_EVENTS for this member ID.'
            }
        }

        // Dapatkan sheetId numerik
        const meta = await sheets.spreadsheets.get({ spreadsheetId })
        const sheetId = meta.data.sheets?.find(
            (s) => s.properties?.title === sheetName
        )?.properties?.sheetId

        if (sheetId === undefined) {
            console.error(`Sheet ID for ${sheetName} not found.`)
            return {
                success: false,
                message: `Sheet ID for ${sheetName} not found`
            }
        }

        // Hapus baris secara fisik menggunakan batchUpdate
        // PENTING: Hapus dari indeks tertinggi ke terendah untuk menghindari pergeseran indeks
        // yang mempengaruhi penghapusan selanjutnya dalam loop yang sama.
        rowIndexesToDelete.sort((a, b) => b - a) // Urutkan dari terbesar ke terkecil

        for (const rowIndex of rowIndexesToDelete) {
            const targetSheetRow = rowIndex + 1 // Baris target di Google Sheet (berbasis 1)
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId,
                                    dimension: 'ROWS',
                                    startIndex: targetSheetRow - 1, // startIndex adalah 0-indexed untuk API
                                    endIndex: targetSheetRow // endIndex adalah eksklusif
                                }
                            }
                        }
                    ]
                }
            })
        }

        return {
            success: true,
            message: `Successfully deleted ${rowIndexesToDelete.length} entries from DB_EVENTS for member ID ${memberId}.`
        }
    } catch (err: any) {
        console.error('Error deleting member from DB_EVENTS:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_EVENTS deletion: ' +
                (err.message || 'Unknown error')
        }
    }
}
