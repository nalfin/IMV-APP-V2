import { NextResponse } from 'next/server' // Import NextResponse untuk respons API
import { getSheetsClient } from '@/lib/utils/sheet-client' // Import klien Google Sheets
import { validateSheetID } from '@/lib/utils/sheet-utils' // Import utilitas sheet

/**
 * Handler untuk memperbarui data member di Google Sheet.
 * Fungsi ini dirancang untuk digunakan dalam App Router Next.js,
 * dan mendukung pembaruan sebagian (partial updates).
 *
 * @param {Request} request - Objek Request standar Web API yang berisi data body.
 * @param {string} id - ID member yang akan diperbarui, diambil dari parameter URL.
 * @returns {Promise<NextResponse>} Respon JSON yang menunjukkan keberhasilan atau kegagalan operasi.
 */
export async function handleUpdateMember(request: Request, id: string) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        console.error('Spreadsheet ID validation error:', error)
        // Mengembalikan NextResponse dengan status 500 jika ada masalah validasi ID spreadsheet
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    // Validasi ID yang diterima dari parameter URL
    if (!id || typeof id !== 'string') {
        return NextResponse.json(
            { success: false, message: 'Missing or invalid member ID in URL' },
            { status: 400 }
        )
    }

    let body
    try {
        // Mengurai body permintaan sebagai JSON. Ini asynchronous.
        body = await request.json()
    } catch (e) {
        // Menangani kasus di mana body permintaan bukan JSON yang valid
        return NextResponse.json(
            { success: false, message: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    // Mendapatkan field-field dari body permintaan. Ini bisa berupa partial update.
    const { member_name, hq, role, trop, status } = body

    // Validasi dasar: Pastikan setidaknya ada satu field yang akan diupdate
    // Selain 'id' yang sudah divalidasi dari URL
    if (Object.keys(body).length === 0) {
        // Memeriksa jika body kosong
        return NextResponse.json(
            { success: false, message: 'No fields provided for update.' },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient() // Mendapatkan instance Google Sheets client

    try {
        // 1. Cari baris index berdasarkan ID
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_MEMBERS!A2:G' // Baca seluruh kolom yang relevan untuk member (ID hingga time_stamp)
        })

        const rows = readRes.data.values || []
        // Mencari index baris di mana ID member cocok
        const rowIndex = rows.findIndex((row) => row[0] === id) // row[0] adalah kolom ID

        if (rowIndex === -1) {
            // Mengembalikan respons 404 jika member tidak ditemukan
            return NextResponse.json(
                { success: false, message: 'Member not found' },
                { status: 404 }
            )
        }

        // targetRow adalah nomor baris di Google Sheet (dimulai dari 1).
        // Karena range dimulai dari A2 (index 0 di array `rows`), maka `rowIndex + 2`
        // akan memberikan nomor baris yang benar di sheet.
        const targetRow = rowIndex + 2

        // 2. Ambil data member yang sudah ada dari baris yang ditemukan
        const existingMemberData = rows[rowIndex] // Ini adalah array [id, member_name, hq, role, trop, status, time_stamp]

        // 3. Gabungkan data yang ada dengan data baru dari request body.
        // Hanya field yang disediakan di request body yang akan menimpa nilai yang ada.
        const updatedValues = [
            existingMemberData[0], // ID (tidak berubah, tetap menggunakan ID yang sudah ada)
            member_name !== undefined ? member_name : existingMemberData[1], // member_name
            hq !== undefined ? hq : existingMemberData[2], // hq
            role !== undefined ? role : existingMemberData[3], // role
            trop !== undefined ? trop : existingMemberData[4], // trop
            status !== undefined ? status : existingMemberData[5], // status
            new Date().toISOString() // time_stamp (selalu diperbarui ke waktu saat ini)
        ]

        // 4. Perbarui baris di Google Sheet dengan data gabungan
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `DB_MEMBERS!A${targetRow}:G${targetRow}`, // Range yang sama dengan kolom yang dibaca
            valueInputOption: 'USER_ENTERED', // Memastikan data diinterpretasikan sebagai yang dimasukkan pengguna
            requestBody: {
                values: [updatedValues] // Kirim array data yang sudah digabungkan
            }
        })

        // Mengembalikan respons sukses dengan data member yang telah diperbarui
        return NextResponse.json(
            {
                success: true,
                message: 'Member updated successfully',
                data: updatedValues
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.error('Error updating member from Google Sheet:', err)
        // Mengembalikan respons error jika terjadi masalah selama operasi pembaruan
        return NextResponse.json(
            { success: false, message: 'Internal Server Error during update.' },
            { status: 500 }
        )
    }
}
