import { getSheetsClient } from '@/lib/utils/sheet-client'
import { generateCustomId, validateSheetID } from '@/lib/utils/sheet-utils'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs' // Import bcryptjs

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

    const { username, password } = body
    const role = body.role || 'member'

    if (!username || !password || !role) {
        return NextResponse.json(
            { success: false, message: 'Missing username, password, or role' },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient()

    try {
        const readUsernamesRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_USERS!B2:B'
        })
        const existingUsernames = readUsernamesRes.data.values?.flat() || []

        if (existingUsernames.includes(username)) {
            return NextResponse.json(
                { success: false, message: 'Username already exists.' },
                { status: 409 } // 409 Conflict
            )
        }

        // --- Hashing Password ---
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // --- Generate ID Baru ---
        const readIdsRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_USERS!A2:A'
        })
        const existingIds = readIdsRes.data.values?.flat() || []
        const newId = generateCustomId(existingIds, 'USR-IMV-', 3)

        const now = new Date().toISOString()

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'DB_USERS',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[newId, username, passwordHash, role, now]]
            }
        })

        return NextResponse.json(
            { success: true, message: 'User added successfully' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error adding user:', error)
        if (error.response) {
            console.error(
                'Google Sheets API error details:',
                error.response.data
            )
            return NextResponse.json(
                {
                    success: false,
                    message: `Google Sheets API error: ${error.response.data.error.message}`
                },
                { status: error.response.status }
            )
        }
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to add user due to server error.'
            },
            { status: 500 }
        )
    }
}
