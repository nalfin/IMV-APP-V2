import { NextResponse } from 'next/server' // Import NextResponse
import { getSheetsClient } from '@/lib/utils/sheet-client'
import { validateSheetID } from '@/lib/utils/sheet-utils'

/**
 * Handler untuk mengambil semua data member dari Google Sheet.
 * Fungsi ini dirancang untuk digunakan dalam App Router Next.js.
 *
 * @returns {Promise<NextResponse>} Respon JSON yang berisi daftar member atau pesan error.
 */
export async function handleGetMembers() {
    // Tidak perlu req, res lagi, karena Request akan ditangani di route.ts
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

    try {
        const sheets = await getSheetsClient() // Mendapatkan instance Google Sheets client
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_MEMBERS!A:G' // Mengambil data dari kolom A sampai G di sheet 'DB_MEMBERS'
        })

        const rows = response.data.values
        // Jika tidak ada baris atau hanya baris header, kembalikan array kosong
        if (!rows || rows.length <= 1) {
            return NextResponse.json([], { status: 200 })
        }

        // Memetakan baris data ke format objek MemberTableType
        // rows.slice(1) untuk melewati baris header
        const data = rows.slice(1).map((row) => ({
            id: row[0],
            member_name: row[1],
            hq: row[2],
            role: row[3],
            trop: row[4],
            status: row[5],
            time_stamp: row[6]
        }))

        // Mengembalikan data member sebagai JSON dengan status 200 OK
        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        console.error('Failed to fetch data from Google Sheet:', err)
        // Mengembalikan NextResponse dengan status 500 jika terjadi error selama pengambilan data
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch data',
                details: err.message || `${err}`
            },
            { status: 500 }
        )
    }
}
