// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { handleAddMember } from '@/lib/api/members/add-member'
import { handleGetMembers } from '@/lib/api/members/get-member'

// Handler untuk GET /api/members
export async function GET(request: Request) {
    return handleGetMembers() // Panggil handler yang sudah diadaptasi
}

// Handler untuk POST /api/members
export async function POST(request: Request) {
    return handleAddMember(request) // Panggil handler yang sudah diadaptasi
}

// Metode lain tidak didukung di rute ini
export async function PUT() {
    return NextResponse.json(
        {
            success: false,
            message:
                'Method Not Allowed for /api/members. Use /api/members/[id] for PUT.'
        },
        { status: 405 }
    )
}

export async function DELETE() {
    return NextResponse.json(
        {
            success: false,
            message:
                'Method Not Allowed for /api/members. Use /api/members/[id] for DELETE.'
        },
        { status: 405 }
    )
}
