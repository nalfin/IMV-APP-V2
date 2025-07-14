// src/lib/api/vsda/get-vsda-event.ts
import { NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/sheets/init'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { PoinVsDAType } from '@/types/vsda.type'
import { format, parse } from 'date-fns'

function convertToIsoDate(dateStr: string): string {
    try {
        const parsed = parse(dateStr, 'd/M/yy', new Date())
        return format(parsed, 'yyyy-MM-dd') // <- pakai leading zero!
    } catch {
        return dateStr
    }
}

export async function handleGetVsDAEvent(request: Request) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const eventName = searchParams.get('event')?.trim() || ''

    if (!from || !to || !eventName) {
        return NextResponse.json(
            { success: false, message: 'Missing from, to, or event parameter' },
            { status: 400 }
        )
    }

    try {
        const sheets = await getSheetsClient()

        // Ambil daftar peserta event
        const eventRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_EVENTS!A2:D'
        })

        const eventRows = eventRes.data.values || []

        const allowedNames = eventRows
            .filter(
                (row) =>
                    row[1] && row[3] && row[3].toString().trim() === eventName
            )
            .map((row) => row[1].toString().trim())

        if (allowedNames.length === 0) {
            return NextResponse.json(
                { success: true, data: [] },
                { status: 200 }
            )
        }

        // Ambil data VSDA
        const vsdaRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_VS_DA!A:ZZ'
        })

        const rows = vsdaRes.data.values
        if (!rows || rows.length < 3) {
            return NextResponse.json(
                { success: true, data: [] },
                { status: 200 }
            )
        }

        const headerRow = rows[1]
        const dataRows = rows.slice(2)

        const startIndex = headerRow.findIndex((d) => d === from)
        const endIndex = headerRow.findIndex((d) => d === to)

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        'Tanggal tidak ditemukan atau tidak valid di header sheet.',
                    from,
                    to
                },
                { status: 400 }
            )
        }

        const result = dataRows
            .map((row) => {
                const id = row[0]
                const name = row[1]?.toString().trim()
                const hq = row[2] ? parseInt(row[2]) : null

                if (!name || !allowedNames.includes(name)) return null

                const data_point_da: PoinVsDAType[] = []
                for (let i = startIndex; i <= endIndex; i++) {
                    data_point_da.push({
                        date: convertToIsoDate(headerRow[i]),
                        value: row[i] ?? ''
                    })
                }

                return { id, member_name: name, hq, data_point_da }
            })
            .filter(Boolean)

        return NextResponse.json(
            { success: true, data: result },
            { status: 200 }
        )
    } catch (err: any) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch VSDA event data',
                details: err.message || `${err}`
            },
            { status: 500 }
        )
    }
}
