import { handleGetMemberSummary } from '@/lib/api/members/get-member-summary'

export async function GET(request: Request) {
    return handleGetMemberSummary() // Panggil handler yang sudah diadaptasi
}
