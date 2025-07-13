// src/lib/api/vsda/get-vsda-event.ts

import { NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/sheets/init'
import { parseCustomDate, formatDateToISO } from '@/lib/utils/format-date'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { PoinVsDAType } from '@/types/vsda.type'
import { parseCustomDateEvent } from '@/lib/utils/format-date-event'

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
    const fromDateStr = searchParams.get('from') || ''
    const toDateStr = searchParams.get('to') || ''
    const eventName = searchParams.get('event') || ''

    if (!fromDateStr || !toDateStr || !eventName) {
        return NextResponse.json(
            { success: false, message: 'Missing from, to, or event parameter' },
            { status: 400 }
        )
    }

    const fromDate = parseCustomDateEvent(fromDateStr)
    const toDate = parseCustomDateEvent(toDateStr)

    if (!fromDate || !toDate || toDate < fromDate) {
        return NextResponse.json(
            { success: false, message: 'Invalid date range' },
            { status: 400 }
        )
    }

    try {
        const sheets = await getSheetsClient()

        // --- Ambil nama peserta event dari sheet DB_EVENT
        const eventRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_EVENTS!A2:D' // A: ID, B: Nama, C: HQ, D: Event
        })

        const eventRows = eventRes.data.values || []

        const allowedNames = eventRows
            .filter(
                (row) =>
                    row[1] && row[3] && row[3].toString().trim() === eventName
            )
            .map((row) => row[1].toString().trim()) // Ambil Nama dari kolom B

        if (allowedNames.length === 0) {
            return NextResponse.json(
                { success: true, data: [] },
                { status: 200 }
            )
        }

        // --- Ambil data dari sheet DB_VS_DA
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

        const dateHeaders = rows[1] // baris kedua = tanggal
        const dataRows = rows.slice(2)

        const result = dataRows
            .map((row) => {
                const id = row[0]
                const name = row[1]?.toString().trim()
                const hq = row[2] ? parseInt(row[2]) : null

                if (!name || !allowedNames.includes(name)) return null

                const data_point_da: PoinVsDAType[] = []

                for (let i = 3; i < dateHeaders.length; i++) {
                    const dateStr = dateHeaders[i]
                    const sheetDate = parseCustomDate(dateStr)

                    if (!sheetDate) continue

                    const isInRange =
                        sheetDate >= fromDate && sheetDate <= toDate

                    if (isInRange) {
                        data_point_da.push({
                            date: formatDateToISO(sheetDate),
                            value: row[i] ?? ''
                        })
                    }
                }

                return {
                    id,
                    member_name: name,
                    hq,
                    data_point_da
                }
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
