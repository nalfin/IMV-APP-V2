// pages/api/vsda/route.ts

import { NextResponse } from 'next/server'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { updatePointsInDbVsDA } from '@/lib/api/vsda/update-point-to-db' // Pastikan path ini benar
import { handleGetVsDA } from '@/lib/api/vsda/get-vsda'

export async function GET(request: Request) {
    return handleGetVsDA(request)
}

export async function PUT(request: Request) {
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

    // Untuk endpoint /api/vsda (tanpa ID), kita selalu mengharapkan body berupa array untuk bulk update
    // Meskipun bisa juga array berisi satu objek untuk update individual
    if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json(
            {
                success: false,
                message:
                    'Invalid request body. Expected an array of point update objects.'
            },
            { status: 400 }
        )
    }

    // Filter out invalid updates (misalnya, jika id, tanggal, atau value_point tidak ada di setiap item array)
    const updatesToProcess = body.filter(
        (item: any) => item.id && item.tanggal && item.value_point
    )

    if (updatesToProcess.length === 0) {
        return NextResponse.json(
            {
                success: false,
                message: 'No valid update data provided in the array.'
            },
            { status: 400 }
        )
    }

    // Panggil fungsi updatePointsInDbVsDA dengan array data
    const result = await updatePointsInDbVsDA(spreadsheetId!, updatesToProcess)

    if (result.success) {
        return NextResponse.json(result, { status: 200 })
    } else {
        return NextResponse.json(result, { status: 500 })
    }
}
