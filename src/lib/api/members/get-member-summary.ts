import { NextResponse } from 'next/server' // Import NextResponse
import { getSheetsClient } from '@/lib/sheets/init'
import { validateSheetID } from '@/lib/sheets/sheet-utils'

// Mendefinisikan interface untuk struktur data summary yang diharapkan
interface MemberSummaryData {
    time_stamp: string
    total: number
    upLevel: number
    midLevel: number
    downLevel: number
    activeCount: number
    inactiveCount: number
}

export async function handleGetMemberSummary() {
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
            spreadsheetId: spreadsheetId!, // Menggunakan non-null assertion karena sudah divalidasi
            range: 'DB_MEMBER_SUMMARY!A:G'
        })

        const rows = response.data.values
        // Jika tidak ada baris atau hanya baris header, kembalikan array kosong
        if (!rows || rows.length <= 1) {
            return NextResponse.json([], { status: 200 })
        }

        // Memetakan baris data ke format objek MemberSummaryData
        // rows.slice(1) untuk melewati baris header
        const data: MemberSummaryData[] = rows.slice(1).map((row) => ({
            time_stamp: String(row[0] || ''), // Pastikan string
            total: Number(row[1] || 0), // Konversi ke number, default 0 jika kosong
            upLevel: Number(row[2] || 0),
            midLevel: Number(row[3] || 0),
            downLevel: Number(row[4] || 0),
            activeCount: Number(row[5] || 0),
            inactiveCount: Number(row[6] || 0)
        }))

        // Mengembalikan data summary sebagai JSON dengan status 200 OK
        return NextResponse.json(data, { status: 200 })
    } catch (err: any) {
        console.error('Failed to fetch data from Google Sheet:', err)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch member summary data', // Pesan lebih spesifik
                details: err.message || `${err}`
            },
            { status: 500 }
        )
    }
}
