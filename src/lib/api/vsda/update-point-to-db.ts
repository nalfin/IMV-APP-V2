import { getSheetsClient } from '@/lib/sheets/init'

interface PointUpdateData {
    id: string
    tanggal: string // Format YYYY-MM-DD
    value_point: string
}

export async function updatePointsInDbVsDA(
    spreadsheetId: string,
    updates: PointUpdateData | PointUpdateData[] // Bisa individu atau array untuk bulk
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_VS_DA'

    try {
        // --- 1. Ambil Data Referensi: ID Member (Kolom A) dan Tanggal (Baris 2) ---
        const [idColRes, dateRowRes] = await Promise.all([
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:A`
            }), // Kolom ID Member
            sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!2:2`
            }) // Baris Tanggal
        ])

        const idRows = idColRes.data.values || []
        // Baris ID Member dimulai dari baris ke-3 (indeks 2 di array)
        // Kita butuh indeks sheet-based, jadi +1 untuk setiap nilai
        const memberIdMap = new Map<string, number>() // Map: memberId -> sheetRowIndex (berbasis 1)
        idRows.forEach((row, idx) => {
            if (idx >= 2 && row[0]) {
                // Mulai dari baris 3 (idx 2)
                memberIdMap.set(String(row[0]), idx + 1)
            }
        })

        const dateRowValues = dateRowRes.data.values?.[0] || []
        // Tanggal dimulai dari Kolom D (indeks 3 di array)
        const dateColMap = new Map<string, number>() // Map: tanggal -> sheetColIndex (berbasis 1)
        dateRowValues.forEach((cellValue, idx) => {
            if (idx >= 3 && cellValue) {
                // Mulai dari Kolom D (idx 3)
                dateColMap.set(String(cellValue), idx + 1)
            }
        })
        // --- Akhir Ambil Data Referensi ---

        const requests: any[] = []
        const processedUpdates: {
            id: string
            tanggal: string
            status: string
            message?: string
        }[] = []

        // Konversi input menjadi array agar bisa diproses secara bulk
        const updatesArray = Array.isArray(updates) ? updates : [updates]

        for (const update of updatesArray) {
            const { id, tanggal, value_point } = update

            const targetRow = memberIdMap.get(id)
            const targetCol = dateColMap.get(tanggal)

            if (!targetRow) {
                processedUpdates.push({
                    id,
                    tanggal,
                    status: 'failed',
                    message: `Member ID '${id}' tidak ditemukan.`
                })
                continue
            }
            if (!targetCol) {
                processedUpdates.push({
                    id,
                    tanggal,
                    status: 'failed',
                    message: `Tanggal '${tanggal}' tidak ditemukan.`
                })
                continue
            }

            // Tambahkan request ke batch update
            requests.push({
                range: `${sheetName}!${String.fromCharCode(64 + targetCol)}${targetRow}`, // Konversi indeks kolom ke huruf (A, B, C...)
                values: [[value_point]]
            })
            processedUpdates.push({ id, tanggal, status: 'success' })
        }

        if (requests.length === 0) {
            return {
                success: false,
                message:
                    'Tidak ada data yang valid untuk diperbarui atau semua ID/Tanggal tidak ditemukan.'
            }
        }

        // --- Lakukan Batch Update ---
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: requests
            }
        })
        // --- Akhir Batch Update ---

        const failedUpdates = processedUpdates.filter(
            (u) => u.status === 'failed'
        )
        if (failedUpdates.length > 0) {
            return {
                success: true, // Masih success karena ada yang berhasil, tapi dengan warning
                message: `Update selesai. Beberapa entri gagal: ${failedUpdates.map((f) => `ID ${f.id} (${f.message})`).join('; ')}`,
                details: processedUpdates
            }
        } else {
            return {
                success: true,
                message: `Berhasil memperbarui ${processedUpdates.length} entri di ${sheetName}.`,
                details: processedUpdates
            }
        }
    } catch (err: any) {
        console.error('Error updating points in DB_VS_DA:', err)
        return {
            success: false,
            message:
                'Internal Server Error saat update DB_VS_DA: ' +
                (err.message || 'Unknown error')
        }
    }
}
