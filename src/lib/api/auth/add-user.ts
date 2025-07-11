import { getSheetsClient } from '@/lib/sheets/init'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { NextResponse } from 'next/server'

export async function handleAddUser(request: Request) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        console.error('Spreadsheet ID validation error:', error)
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    let body
    try {
        body = await request.json()
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    const { id, username, password, role, time_stamp } = body

    if (!username || !password || !role) {
        return NextResponse.json(
            { success: false, message: 'Missing username, password, or role' },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient()

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'DB_USERS',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[id, username, password, role, time_stamp]]
        }
    })

    return NextResponse.json({ success: true }, { status: 200 })
}
