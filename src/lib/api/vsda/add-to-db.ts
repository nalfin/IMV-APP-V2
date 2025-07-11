import { getSheetsClient } from '@/lib/utils/sheet-client'

/**
 * Menambahkan entri member baru ke sheet DB_VS_DA.
 * Asumsi struktur DB_VS_DA: A=ID, B=Nama, C=HQ.
 * @param spreadsheetId ID Spreadsheet Google Sheets.
 * @param memberId ID member yang akan ditambahkan.
 * @param memberName Nama member.
 * @param hqLevel Level HQ member.
 * @returns Objek { success: boolean, message: string }
 */
export async function addMemberToDbVsda(
    spreadsheetId: string,
    memberId: string,
    memberName: string,
    hqLevel: number
) {
    const sheets = await getSheetsClient()
    const sheetName = 'DB_VS_DA'

    try {
        // Membaca seluruh kolom A untuk menemukan baris kosong berikutnya.
        // Ini akan memberikan array yang mencakup semua baris yang ada.
        const columnARes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`
        })

        const columnAValues = columnARes.data.values || []
        let nextRow = 1 // Mulai pencarian dari baris 1 (header mungkin ada di baris 1 atau 2)

        // Temukan baris kosong pertama (1-indexed)
        // Kita iterasi dari awal array (indeks 0) yang sesuai dengan baris 1 di sheet.
        // Jika sel kosong, itu adalah baris berikutnya yang tersedia.
        for (let i = 0; i < columnAValues.length; i++) {
            if (!columnAValues[i][0]) {
                // Jika sel di kolom A kosong
                nextRow = i + 1 // Baris kosong (berbasis 1)
                break
            }
            nextRow++ // Jika tidak kosong, lanjutkan ke baris berikutnya
        }
        // Jika loop selesai dan tidak menemukan sel kosong,
        // berarti semua baris terisi, jadi nextRow adalah baris setelah data terakhir.
        // nextRow sudah benar karena diinkremen di setiap iterasi.

        // Jika sheet benar-benar kosong atau hanya header, nextRow akan menjadi 1 atau 2.
        // Asumsi data dimulai dari baris 3 di DB_VS_DA, kita perlu memastikan nextRow setidaknya 3.
        if (nextRow < 3) {
            // Jika nextRow yang ditemukan kurang dari 3 (misal 1 atau 2),
            // dan baris 3 (indeks 2) sudah ada data, kita harus mulai dari setelah data terakhir.
            // Jika sheet benar-benar kosong kecuali header, nextRow akan tetap 3.
            if (
                columnAValues.length > 2 &&
                columnAValues[2] &&
                columnAValues[2][0]
            ) {
                // Jika baris 3 sudah ada data, cari baris setelah data terakhir
                nextRow = columnAValues.length + 1
            } else {
                // Jika baris 3 kosong atau tidak ada, mulai dari baris 3
                nextRow = 3
            }
        }

        // Menambahkan baris baru ke Google Sheet
        // Menggunakan update untuk menulis ke baris spesifik
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A${nextRow}:C${nextRow}`, // Update range spesifik A-C
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[memberId, memberName, hqLevel]]
            }
        })

        return {
            success: true,
            message: `Member ${memberId} added to DB_VS_DA successfully.`
        }
    } catch (err: any) {
        console.error('Error adding member to DB_VS_DA:', err)
        return {
            success: false,
            message:
                'Internal Server Error during DB_VS_DA add: ' +
                (err.message || 'Unknown error')
        }
    }
}
