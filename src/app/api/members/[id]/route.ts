import { NextResponse } from 'next/server'
import { validateSheetID } from '@/lib/sheets/sheet-utils'
import { updateMemberInDbMembers } from '@/lib/api/members/update-to-db'
import { updateMemberInDbVsda } from '@/lib/api/vsda/update-to-db' // Import fungsi baru
import { updateMemberInDbEvents } from '@/lib/api/events/update-to-db' // Import fungsi yang diperbarui
import { deleteMemberFromDbMembers } from '@/lib/api/members/delete-from-db'
import { deleteMemberFromDbVsda } from '@/lib/api/vsda/delete-from-db'
import { deleteMemberFromDbEvents } from '@/lib/api/events/delete-from-db'
import { calculateMemberSummary } from '@/lib/api/members/calculate-member-summary'
import { updateMemberSummaryInDb } from '@/lib/api/members/update-member-summary'

// Handler untuk PUT /api/members/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const memberId = params.id

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

    const { member_name, hq, role, trop, status } = body

    if (Object.keys(body).length === 0) {
        return NextResponse.json(
            { success: false, message: 'No fields provided for update.' },
            { status: 400 }
        )
    }

    // --- Langkah 1: Update DB_MEMBERS ---
    const dbMembersResult = await updateMemberInDbMembers(
        spreadsheetId!,
        memberId,
        {
            member_name,
            hq,
            role,
            trop,
            status
        }
    )

    if (!dbMembersResult.success) {
        return NextResponse.json(dbMembersResult, { status: 500 })
    }

    // PENTING: Tambahkan pemeriksaan untuk memastikan dbMembersResult.data tidak undefined
    if (!dbMembersResult.data) {
        console.error('DB_MEMBERS update succeeded but no data was returned.')
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to retrieve updated member data.'
            },
            { status: 500 }
        )
    }

    const updatedMemberName = dbMembersResult.data[1]
    const updatedHq = dbMembersResult.data[2]

    // --- Langkah 2: Update DB_VS_DA (jika nama atau HQ berubah) ---
    let dbVsdaResult = {
        success: true,
        message: 'No relevant changes for DB_VS_DA.'
    }
    if (member_name !== undefined || hq !== undefined) {
        dbVsdaResult = await updateMemberInDbVsda(
            spreadsheetId!,
            memberId,
            updatedMemberName,
            updatedHq
        )
        if (!dbVsdaResult.success) {
            console.error('Failed to update DB_VS_DA:', dbVsdaResult.message)
            // Anda bisa memilih untuk mengembalikan error di sini atau hanya log dan melanjutkan
            // return NextResponse.json(dbVsdaResult, { status: 500 });
        }
    }

    // --- Langkah 3: Update DB_EVENTS (jika nama atau HQ berubah) ---
    let dbEventsResult = {
        success: true,
        message: 'No relevant changes for DB_EVENTS.'
    }
    if (member_name !== undefined || hq !== undefined) {
        dbEventsResult = await updateMemberInDbEvents(
            spreadsheetId!,
            memberId,
            updatedMemberName,
            updatedHq
        )
        if (!dbEventsResult.success) {
            console.error('Failed to update DB_EVENTS:', dbEventsResult.message)
            // Anda bisa memilih untuk mengembalikan error di sini atau hanya log dan melanjutkan
            // return NextResponse.json(dbEventsResult, { status: 500 });
        }
    }

    // --- Langkah 4: Update DB_MEMBER_SUMMARY ---
    let summaryResult = {
        success: true,
        message: 'Member summary not updated.'
    }
    try {
        const summary = await calculateMemberSummary(spreadsheetId!)
        summaryResult = await updateMemberSummaryInDb(spreadsheetId!, summary)
        if (!summaryResult.success) {
            console.error(
                'Failed to update DB_MEMBER_SUMMARY:',
                summaryResult.message
            )
            // Kegagalan di summary mungkin tidak kritis, jadi kita hanya log dan lanjutkan.
        }
    } catch (summaryErr: any) {
        console.error(
            'Error during member summary calculation or update:',
            summaryErr
        )
        summaryResult = {
            success: false,
            message: 'Error calculating or updating member summary.'
        }
    }

    // Jika semua update berhasil (atau tidak ada yang perlu diupdate di sheet lain)
    return NextResponse.json(
        {
            success: true,
            message: 'Member and associated entries updated successfully!',
            dbMembers: dbMembersResult,
            dbVsda: dbVsdaResult,
            dbEvents: dbEventsResult,
            dbSummary: summaryResult // Tambahkan hasil summary ke respons
        },
        { status: 200 }
    )
}

// Handler untuk DELETE /api/members/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const memberId = params.id // Mengambil ID member dari parameter URL

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

    // --- Langkah 1: Hapus dari DB_MEMBERS ---
    // Menggunakan non-null assertion operator '!' karena sudah divalidasi di atas
    const dbMembersResult = await deleteMemberFromDbMembers(
        spreadsheetId!,
        memberId
    )

    if (!dbMembersResult.success) {
        // Jika member tidak ditemukan di DB_MEMBERS, mungkin tidak ada di sheet lain juga
        // atau ini adalah error yang perlu dihentikan.
        return NextResponse.json(dbMembersResult, {
            status: dbMembersResult.message.includes('not found') ? 404 : 500
        })
    }

    // --- Langkah 2: Hapus dari DB_VS_DA ---
    // Tidak perlu cek success secara ketat di sini, karena mungkin tidak ada entri di DB_VS_DA
    // dan kita ingin melanjutkan penghapusan di DB_EVENTS.
    const dbVsdaResult = await deleteMemberFromDbVsda(spreadsheetId!, memberId)
    if (!dbVsdaResult.success) {
        console.error('Failed to delete from DB_VS_DA:', dbVsdaResult.message)
        // Anda bisa memilih untuk mengembalikan error di sini jika kegagalan di DB_VS_DA kritis
        // return NextResponse.json(dbVsdaResult, { status: 500 });
    }

    // --- Langkah 3: Hapus dari DB_EVENTS ---
    const dbEventsResult = await deleteMemberFromDbEvents(
        spreadsheetId!,
        memberId
    )
    if (!dbEventsResult.success) {
        console.error(
            'Failed to delete from DB_EVENTS:',
            dbEventsResult.message
        )
        // Anda bisa memilih untuk mengembalikan error di sini jika kegagalan di DB_EVENTS kritis
        // return NextResponse.json(dbEventsResult, { status: 500 });
    }

    // Jika penghapusan dari DB_MEMBERS berhasil, dan penghapusan di sheet lain ditangani
    return NextResponse.json(
        {
            success: true,
            message: `Member ${memberId} and associated entries deleted successfully!`,
            dbMembers: dbMembersResult,
            dbVsda: dbVsdaResult,
            dbEvents: dbEventsResult
        },
        { status: 200 }
    )
}
