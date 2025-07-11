import { NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/utils/sheet-client'
import { validateSheetID } from '@/lib/utils/sheet-utils'

export async function handleAddEvents(request: Request) {
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
    } catch (e) {
        console.error('Error parsing request body:', e)
        return NextResponse.json(
            { success: false, message: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    // Destrukturisasi payload yang benar dari klien
    const { eventName, payloadMembers } = body

    // Validasi field yang wajib diisi
    if (
        !eventName ||
        typeof eventName !== 'string' ||
        eventName.trim() === ''
    ) {
        return NextResponse.json(
            { success: false, message: 'Event name is required.' },
            { status: 400 }
        )
    }
    if (!Array.isArray(payloadMembers) || payloadMembers.length === 0) {
        return NextResponse.json(
            {
                success: false,
                message: 'At least one member is required for the event.'
            },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient() // Mendapatkan instance Google Sheets client

    try {
        // --- Logic untuk menambahkan Event ke Google Sheet ---
        const eventSheetName = 'DB_EVENTS!A:E' // Ganti dengan nama sheet event Anda
        const now = new Date().toISOString() // Mendapatkan timestamp saat ini

        // Menyiapkan array baris untuk ditambahkan ke Google Sheet
        // Setiap member dalam payloadMembers akan menjadi satu baris terpisah
        // Sesuai dengan struktur kolom: A=ID, B=MEMBER_NAME, C=HQ, D=EVENT NAME, E=TIME_STAMP
        const rowsToAppend = payloadMembers.map((member) => [
            member.id, // Kolom A: ID (ID dari member itu sendiri)
            member.member_name, // Kolom B: MEMBER_NAME
            member.hq, // Kolom C: HQ
            eventName, // Kolom D: EVENT NAME
            now // Kolom E: TIME_STAMP
        ])

        // Menambahkan baris baru ke Google Sheet untuk event
        // Ini akan menambahkan semua baris sekaligus
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: eventSheetName, // Range target untuk penambahan data event
            valueInputOption: 'USER_ENTERED', // Memastikan data diinterpretasikan sebagai yang dimasukkan pengguna
            requestBody: {
                values: rowsToAppend // Mengirim array of arrays (banyak baris)
            }
        })

        // Mengembalikan respons sukses
        return NextResponse.json(
            {
                success: true,
                message: 'Event and associated members added successfully!'
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.error('Error adding event to Google Sheet:', err)
        // Mengembalikan respons error jika terjadi masalah selama operasi penambahan
        return NextResponse.json(
            {
                success: false,
                message:
                    'Internal Server Error during event add: ' +
                    (err.message || 'Unknown error')
            },
            { status: 500 }
        )
    }
}
