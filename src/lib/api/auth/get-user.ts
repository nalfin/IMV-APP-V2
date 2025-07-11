import { getSheetsClient } from '@/lib/sheets/init'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { time } from 'console'
import { NextResponse } from 'next/server'

export async function handleGetUsers() {
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
            range: 'DB_USERS!A:E'
        })

        const rows = response.data.values
        if (!rows || rows.length <= 1) {
            return NextResponse.json([], { status: 200 })
        }

        const users = rows.slice(1).map((row) => ({
            id: row[0],
            username: row[1],
            password: row[2],
            role: row[3],
            time_stamp: row[4]
        }))

        return NextResponse.json(users, { status: 200 })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { success: false, message: 'Error fetching users' },
            { status: 500 }
        )
    }
}
