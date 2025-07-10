import { NextResponse } from 'next/server' // Import NextResponse untuk respons API
import { getSheetsClient } from '@/lib/utils/sheet-client' // Import klien Google Sheets
import { validateSheetID, generateCustomId } from '@/lib/utils/sheet-utils' // Import utilitas sheet

/**
 * Handler untuk menambahkan member baru ke Google Sheet.
 * Fungsi ini dirancang untuk digunakan dalam App Router Next.js.
 *
 * @param {Request} request - Objek Request standar Web API yang berisi data body.
 * @returns {Promise<NextResponse>} Respon JSON yang menunjukkan keberhasilan atau kegagalan operasi.
 */
export async function handleAddMember(request: Request) {
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

    // Mendapatkan field-field yang diperlukan dari body permintaan
    const { member_name, hq, role, trop, status } = body

    // Validasi field yang wajib diisi
    if (!member_name || !hq || !role || !trop || !status) {
        return NextResponse.json(
            { success: false, message: 'Missing required fields' },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient() // Mendapatkan instance Google Sheets client

    try {
        // Membaca ID yang sudah ada untuk memastikan ID baru unik
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_MEMBERS!A2:A' // Asumsi kolom A berisi ID member
        })

        const existingIds = (readRes.data.values || []).map((row) => row[0])
        // Menghasilkan ID kustom baru yang unik
        const newId = generateCustomId(existingIds, 'MBR-IMV-', 3)
        const now = new Date().toISOString() // Mendapatkan timestamp saat ini

        // Menambahkan baris baru ke Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'DB_MEMBERS', // Range target untuk penambahan data
            valueInputOption: 'USER_ENTERED', // Memastikan data diinterpretasikan sebagai yang dimasukkan pengguna
            requestBody: {
                // Baris data baru yang akan ditambahkan
                values: [[newId, member_name, hq, role, trop, status, now]]
            }
        })

        // Mengembalikan respons sukses dengan ID member yang baru dibuat
        return NextResponse.json({ success: true, id: newId }, { status: 200 })
    } catch (err: any) {
        console.error('Error adding member to Google Sheet:', err)
        // Mengembalikan respons error jika terjadi masalah selama operasi penambahan
        return NextResponse.json(
            { success: false, message: 'Internal Server Error during add.' },
            { status: 500 }
        )
    }
}
