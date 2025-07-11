import { getSheetsClient } from '@/lib/utils/sheet-client'

export async function updateMemberInDbEvents(
    spreadsheetId: string,
    memberId: string,
    newMemberName: string,
    newHq: number
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_EVENTS' // Nama sheet untuk data event

    try {
        // Membaca semua data dari DB_EVENTS
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:E` // Membaca semua kolom yang relevan
        })

        let rows = readRes.data.values || []
        const header = rows.shift() // Pisahkan header jika ada

        let updatedRowsCount = 0
        const now = new Date().toISOString() // Timestamp baru untuk baris yang diperbarui

        // Iterasi melalui baris data untuk menemukan dan memperbarui entri yang cocok
        const updatedData = rows.map((row, idx) => {
            if (row[0] === memberId) {
                // row[0] adalah Kolom A (ID member)
                const updatedRow = [...row] // Buat salinan baris untuk dimodifikasi
                updatedRow[1] = newMemberName // Kolom B: MEMBER_NAME
                updatedRow[2] = newHq // Kolom C: HQ
                updatedRow[4] = now // Kolom E: TIME_STAMP
                updatedRowsCount++
                return updatedRow
            }
            return row // Kembalikan baris asli jika tidak cocok
        })

        // Jika ada header, tambahkan kembali ke awal array
        if (header) {
            updatedData.unshift(header)
        }

        if (updatedRowsCount === 0) {
            return {
                success: true,
                message:
                    'No matching entries found in DB_EVENTS for this member ID.'
            }
        }

        // Menulis kembali seluruh rentang yang dimodifikasi ke Google Sheet
        // Ini adalah cara paling aman untuk memperbarui banyak baris tanpa kehilangan data lain
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:E${updatedData.length}`, // Menulis kembali dari baris 1 (termasuk header)
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: updatedData
            }
        })

        return {
            success: true,
            message: `Successfully updated ${updatedRowsCount} entries in DB_EVENTS for member ID ${memberId}.`
        }
    } catch (err: any) {
        console.error('Error updating member in DB_EVENTS:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_EVENTS update: ' +
                (err.message || 'Unknown error')
        }
    }
}
