import { NextResponse } from 'next/server' // Import NextResponse
import { getSheetsClient } from '@/lib/utils/sheet-client'
import { validateSheetID } from '@/lib/utils/sheet-utils'
// Asumsi googleapis tidak diperlukan di sini karena getSheetsClient sudah menanganinya

export async function handleGetListEvents() {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        console.error('Spreadsheet ID validation error:', error)
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    try {
        const sheets = await getSheetsClient()
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_EVENTS!G:G' // Ini sudah benar untuk mengambil hanya kolom G
        })

        const rows = response.data.values
        if (!rows || rows.length <= 1) {
            return NextResponse.json([], { status: 200 })
        }

        const data = rows.slice(1).map((row) => ({
            value: row[0],
            label: row[0]
        }))

        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        console.error('Failed to fetch data from Google Sheet:', err)
        // Mengembalikan NextResponse dengan status 500 jika terjadi error selama pengambilan data
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch event list data', // Pesan lebih spesifik
                details: err.message || `${err}`
            },
            { status: 500 }
        )
    }
}
