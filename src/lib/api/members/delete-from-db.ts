import { getSheetsClient } from '@/lib/sheets/init'

/**
 * Menghapus member dari sheet DB_MEMBERS.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @param memberId ID member yang akan dihapus.
 * @returns Objek { success: boolean, message: string }
 */
export async function deleteMemberFromDbMembers(
    spreadsheetId: string,
    memberId: string
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_MEMBERS'

    try {
        // Membaca hanya kolom A (ID) untuk menemukan baris yang cocok
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`
        })

        const rows = readRes.data.values || []
        // Mencari indeks baris (berbasis 0) dari member yang akan dihapus
        // Dimulai dari baris 1 (setelah header)
        const rowIndex = rows.findIndex(
            (row, idx) => idx > 0 && row[0] === memberId
        )

        if (rowIndex === -1) {
            return { success: false, message: 'Member not found in DB_MEMBERS' }
        }

        // targetSheetRow adalah nomor baris 1-indexed di Google Sheet
        const targetSheetRow = rowIndex + 1 // +1 karena array berbasis 0

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

        return {
            success: true,
            message: `Member ${memberId} deleted successfully from DB_MEMBERS.`
        }
    } catch (err: any) {
        console.error('Error deleting member from DB_MEMBERS:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_MEMBERS deletion: ' +
                (err.message || 'Unknown error')
        }
    }
}
