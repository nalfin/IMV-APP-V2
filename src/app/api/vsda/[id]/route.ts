// pages/api/member-points/[id].ts atau app/api/member-points/[id]/route.ts
import { NextResponse } from 'next/server'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { updatePointsInDbVsDA } from '@/lib/api/vsda/update-point-to-db'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const memberId = params.id // Member ID dari URL
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        console.error('Spreadsheet ID validation error:', error)
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    if (!memberId || typeof memberId !== 'string') {
        return NextResponse.json(
            { success: false, message: 'Missing or invalid member ID in URL' },
            { status: 400 }
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

    // Body bisa berupa objek tunggal untuk update individu, atau array untuk bulk
    // Contoh: { "tanggal": "2025-06-24", "value_point": "9🎁" }
    // Atau: [ { "id": "MBR-IMV-001", "tanggal": "2025-06-24", "value_point": "9🎁" }, ... ]

    // Untuk skenario Anda, memberId dari params.id hanya relevan untuk single update.
    // Jika Anda ingin bulk update dengan ID yang berbeda, maka ID harus ada di dalam body.
    // Saya akan asumsikan endpoint ini bisa digunakan untuk:
    // 1. Single update: ID dari params.id, tanggal/point dari body.
    // 2. Bulk update: body adalah array objek, dan id di dalam setiap objek body.

    let updatesToProcess

    if (Array.isArray(body)) {
        // Bulk update: pastikan setiap objek di array memiliki 'id', 'tanggal', 'value_point'
        updatesToProcess = body.map((item) => ({
            id: item.id || memberId, // Fallback ke params.id jika tidak ada di item (untuk konsistensi)
            tanggal: item.tanggal,
            value_point: item.value_point
        }))
    } else if (typeof body === 'object' && body !== null) {
        // Single update: gunakan params.id dan data dari body
        updatesToProcess = [
            {
                id: memberId,
                tanggal: body.tanggal,
                value_point: body.value_point
            }
        ]
    } else {
        return NextResponse.json(
            {
                success: false,
                message:
                    'Invalid request body format. Expected single object or array of objects.'
            },
            { status: 400 }
        )
    }

    // Filter out invalid updates (misalnya, jika tanggal atau value_point tidak ada)
    updatesToProcess = updatesToProcess.filter(
        (u) => u.id && u.tanggal && u.value_point
    )
    if (updatesToProcess.length === 0) {
        return NextResponse.json(
            { success: false, message: 'No valid update data provided.' },
            { status: 400 }
        )
    }

    const result = await updatePointsInDbVsDA(spreadsheetId!, updatesToProcess)

    if (result.success) {
        return NextResponse.json(result, { status: 200 })
    } else {
        return NextResponse.json(result, { status: 500 })
    }
}
