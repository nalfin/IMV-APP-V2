// src/lib/api/vsda/get-vsda.ts
import { NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/sheets/init'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { format, parse } from 'date-fns'

function convertToIsoDate(dateStr: string): string {
    try {
        const parsed = parse(dateStr, 'd/M/yy', new Date())
        return format(parsed, 'yyyy-MM-dd') // <- pakai leading zero!
    } catch {
        return dateStr
    }
}

export async function handleGetVsDA(request: Request) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    const { searchParams } = new URL(request.url)
    const fromDateStr = searchParams.get('from') || ''
    const toDateStr = searchParams.get('to') || ''

    try {
        const sheets = await getSheetsClient()
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_VS_DA!A:ZZ'
        })

        const rows = response.data.values
        if (!rows || rows.length < 3) {
            return NextResponse.json([], { status: 200 })
        }

        const headerRow = rows[1] // baris tanggal
        const dataRows = rows.slice(2)

        const startCol = headerRow.findIndex((date) => date === fromDateStr)
        const endCol = headerRow.findIndex((date) => date === toDateStr)

        if (startCol === -1 || endCol === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Tanggal tidak ditemukan di header sheet.',
                    fromDateStr,
                    toDateStr
                },
                { status: 400 }
            )
        }

        const result = dataRows.map((row) => {
            const id = row[0]
            const member_name = row[1]
            const hq = row[2] ? parseInt(row[2]) : null
            const data_point_da = []

            for (let i = startCol; i <= endCol; i++) {
                data_point_da.push({
                    date: convertToIsoDate(headerRow[i]),
                    value: row[i] ?? ''
                })
            }

            return { id, member_name, hq, data_point_da }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (err: any) {
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal ambil data dari sheet.',
                details: err.message
            },
            { status: 500 }
        )
    }
}
