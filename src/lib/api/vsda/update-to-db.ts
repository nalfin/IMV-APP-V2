import { getSheetsClient } from '@/lib/utils/sheet-client'

export async function updateMemberInDbVsda(
    spreadsheetId: string,
    memberId: string,
    newMemberName: string,
    newHq: number
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_VS_DA'

    try {
        // Membaca hanya kolom ID (A) untuk menemukan baris yang cocok
        // Asumsi data dimulai dari baris 3 (A3:A)
        const idReadRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A` // Membaca seluruh kolom A
        })

        const idRows = idReadRes.data.values || []
        // Mencari indeks baris (berbasis 0) dari member yang akan diperbarui
        // Perhatikan: Karena Apps Script Anda mulai dari A3, kita perlu menyesuaikan indeks.
        // Jika getValues() dari A3:C, maka indeks 0 di array adalah baris 3 di sheet.
        // Di Google Sheets API, kita membaca seluruh kolom A, jadi kita cari ID di sana.
        // Jika header ada di baris 1 dan 2, maka data dimulai dari indeks 2 (baris 3)
        const rowIndex = idRows.findIndex(
            (row, idx) => idx >= 2 && row[0] === memberId
        ) // idx >= 2 untuk mulai dari baris 3

        if (rowIndex === -1) {
            return {
                success: true,
                message:
                    'No matching entries found in DB_VS_DA for this member ID.'
            }
        }

        // Baris target di Google Sheet (berbasis 1, termasuk header)
        const targetSheetRow = rowIndex + 1

        // Melakukan update pada kolom B (Nama) dan C (HQ)
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!B${targetSheetRow}:C${targetSheetRow}`, // Update hanya kolom B dan C
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[newMemberName, newHq]] // Mengirim nama dan HQ baru
            }
        })

        return {
            success: true,
            message: `Successfully updated member ID ${memberId} in DB_VS_DA.`
        }
    } catch (err: any) {
        console.error('Error updating member in DB_VS_DA:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_VS_DA update: ' +
                (err.message || 'Unknown error')
        }
    }
}
