import { getSheetsClient } from '@/lib/utils/sheet-client'

export async function updateMemberInDbMembers(
    spreadsheetId: string,
    memberId: string,
    updateData: {
        member_name?: string
        hq?: number // Menggunakan 'hq' sesuai dengan tipe MemberTableType
        role?: string
        trop?: number
        status?: string
    }
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_MEMBERS'

    try {
        // Membaca hanya kolom ID (A) untuk menemukan baris yang cocok
        const idReadRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`
        })

        const idRows = idReadRes.data.values || []
        // Mencari indeks baris (berbasis 0) dari member yang akan diperbarui
        // Dimulai dari baris 1 (setelah header)
        const rowIndex = idRows.findIndex(
            (row, idx) => idx > 0 && row[0] === memberId
        )

        if (rowIndex === -1) {
            return { success: false, message: 'Member not found in DB_MEMBERS' }
        }

        // Baris target di Google Sheet (berbasis 1, termasuk header)
        const targetSheetRow = rowIndex + 1

        // Membaca data yang ada untuk baris tersebut agar bisa menggabungkan perubahan
        const existingDataRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A${targetSheetRow}:G${targetSheetRow}`
        })
        const existingRowData = existingDataRes.data.values?.[0] || []

        // Membangun array nilai yang akan diupdate
        // Menggunakan nilai yang ada jika tidak disediakan di updateData
        const valuesToUpdate = [
            existingRowData[0], // Kolom A: ID (tidak berubah)
            updateData.member_name !== undefined
                ? updateData.member_name
                : existingRowData[1], // Kolom B: MEMBER_NAME
            updateData.hq !== undefined ? updateData.hq : existingRowData[2], // Kolom C: HQ
            updateData.role !== undefined
                ? updateData.role
                : existingRowData[3], // Kolom D: ROLE
            updateData.trop !== undefined
                ? updateData.trop
                : existingRowData[4], // Kolom E: TROP
            updateData.status !== undefined
                ? updateData.status
                : existingRowData[5], // Kolom F: STATUS
            new Date().toISOString() // Kolom G: TIME_STAMP (selalu diperbarui)
        ]

        // Melakukan update pada baris spesifik di Google Sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A${targetSheetRow}:G${targetSheetRow}`, // Range spesifik untuk baris yang diperbarui
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [valuesToUpdate] // Mengirim satu baris data
            }
        })

        return {
            success: true,
            message: 'Member updated successfully in DB_MEMBERS',
            data: valuesToUpdate
        }
    } catch (err: any) {
        console.error('Error updating member in DB_MEMBERS:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_MEMBERS update: ' +
                (err.message || 'Unknown error')
        }
    }
}
