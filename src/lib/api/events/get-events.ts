import { NextResponse } from 'next/server' // Import NextResponse
import { getSheetsClient } from '@/lib/utils/sheet-client'
import { validateSheetID } from '@/lib/utils/sheet-utils'

export async function handleGetEvents() {
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
        const sheets = await getSheetsClient()
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_EVENTS!A:E'
        })

        const rows = response.data.values
        if (!rows || rows.length <= 1) {
            return NextResponse.json([], { status: 200 })
        }

        const data = rows.slice(1).map((row) => ({
            id: row[0],
            member_name: row[1],
            hq: row[2],
            event_names: row[3],
            time_stamp: row[4]
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
