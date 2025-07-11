import { NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/utils/sheet-client'
import { generateCustomId, validateSheetID } from '@/lib/utils/sheet-utils' // generateCustomId tidak lagi digunakan
import { addMemberToDbVsda } from '@/lib/api/vsda/add-to-db'

export async function handleAddMember(request: Request) {
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

    // Mendapatkan field-field yang diperlukan dari body permintaan
    // Menggunakan 'name' dan 'lvl' sesuai Apps Script Anda
    const { member_name, hq, role, trop, status } = body

    // Validasi field yang wajib diisi
    if (!member_name || !hq || !role || !trop || !status) {
        return NextResponse.json(
            {
                success: false,
                message:
                    'Missing required fields (member_name, hq, role, trop, status)'
            },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient() // Mendapatkan instance Google Sheets client

    try {
        // --- Logic untuk insertMemberToDB ---
        const memberSheetName = 'DB_MEMBERS' // Nama sheet member
        const columnARes = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId!, // Menggunakan non-null assertion
            range: `${memberSheetName}!A:A` // Membaca seluruh kolom A
        })

        const columnAValues = columnARes.data.values || []
        let nextRow = 2 // Default mulai dari baris 2 (setelah header)
        for (let i = 0; i < columnAValues.length; i++) {
            if (!columnAValues[i][0]) {
                // Jika sel di kolom A kosong
                nextRow = i + 1 // Baris kosong (berbasis 1)
                break
            }
        }
        // Jika tidak ada sel kosong ditemukan, nextRow akan menjadi (jumlah baris + 1)
        if (
            nextRow === 2 &&
            columnAValues.length > 0 &&
            columnAValues[1] &&
            columnAValues[1][0]
        ) {
            nextRow = columnAValues.length + 1 // Jika A2 tidak kosong dan tidak ada baris kosong di tengah
        }

        // Membaca ID yang sudah ada untuk memastikan ID baru unik
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_MEMBERS!A2:A' // Asumsi kolom A berisi ID member
        })
        const existingIds = (readRes.data.values || []).map((row) => row[0])
        const idFormat = generateCustomId(existingIds, 'MBR-IMV-', 3)
        const now = new Date().toISOString() // Mendapatkan timestamp saat ini

        // Menambahkan baris baru ke Google Sheet DB_MEMBER
        await sheets.spreadsheets.values.update({
            // Menggunakan update untuk menulis ke baris spesifik
            spreadsheetId: spreadsheetId!,
            range: `${memberSheetName}!A${nextRow}:G${nextRow}`, // Range target untuk penambahan data
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[idFormat, member_name, hq, role, trop, status, now]]
            }
        })
        // --- Akhir Logic untuk insertMemberToDB ---

        // --- Logic untuk insertVSDAToDB ---
        const vsdaResult = await addMemberToDbVsda(
            spreadsheetId!,
            idFormat,
            member_name,
            hq
        )
        if (!vsdaResult.success) {
            console.error(
                'Failed to add member to DB_VS_DA:',
                vsdaResult.message
            )
            // Anda bisa memilih untuk mengembalikan error di sini
            // atau hanya log dan tetap mengembalikan sukses jika DB_MEMBER berhasil
            // Untuk saat ini, kita akan mengembalikan error jika DB_VS_DA gagal
            return NextResponse.json(vsdaResult, { status: 500 })
        }
        // --- Akhir Logic untuk insertVSDAToDB ---

        // Mengembalikan respons sukses dengan ID member yang baru dibuat
        return NextResponse.json(
            {
                success: true,
                message: 'Data member berhasil ditambahkan',
                data: { id: idFormat }
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.error('Error adding member to Google Sheet:', err)
        return NextResponse.json(
            {
                success: false,
                message:
                    'Internal Server Error during add: ' +
                    (err.message || 'Unknown error')
            },
            { status: 500 }
        )
    }
}
