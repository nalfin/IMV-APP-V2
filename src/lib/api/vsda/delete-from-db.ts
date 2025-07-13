import { getSheetsClient } from '@/lib/sheets/init'

/**
 * Menghapus entri member dari sheet DB_VS_DA berdasarkan ID member.
 * Asumsi struktur DB_VS_DA: A=ID, B=Nama, C=HQ.
 * Ini akan menghapus *baris pertama yang cocok* jika ada duplikat ID.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @param memberId ID member yang akan dihapus.
 * @returns Objek { success: boolean, message: string }
 */
export async function deleteMemberFromDbVsDA(
    spreadsheetId: string,
    memberId: string
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_VS_DA'

    try {
        // Membaca hanya kolom A (ID) untuk menemukan baris yang cocok
        // Asumsi data di DB_VS_DA dimulai dari baris 3 (indeks 2 di array)
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A` // Membaca seluruh kolom A
        })

        const rows = readRes.data.values || []
        // Mencari indeks baris (berbasis 0) dari member yang akan dihapus
        // Dimulai dari indeks 2 (baris 3) karena Apps Script Anda mulai dari A3
        let rowIndexToDelete: number | null = null
        for (let i = 0; i < rows.length; i++) {
            if (i >= 2 && rows[i][0] === memberId) {
                // i >= 2 untuk mulai dari baris 3
                rowIndexToDelete = i
                break // Hapus hanya entri pertama yang cocok (sesuai Apps Script Anda)
            }
        }

        if (rowIndexToDelete === null) {
            return {
                success: true,
                message:
                    'No matching entries found in DB_VS_DA for this member ID.'
            }
        }

        // targetSheetRow adalah nomor baris 1-indexed di Google Sheet
        const targetSheetRow = rowIndexToDelete + 1

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
            message: `Member ${memberId} deleted successfully from DB_VS_DA.`
        }
    } catch (err: any) {
        console.error('Error deleting member from DB_VS_DA:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_VS_DA deletion: ' +
                (err.message || 'Unknown error')
        }
    }
}
