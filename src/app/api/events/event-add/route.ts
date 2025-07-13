import { handleAddEvents } from '@/lib/api/events/add-event'

// Handler untuk POST /api/members
export async function POST(request: Request) {
    return handleAddEvents(request) // Panggil handler yang sudah diadaptasi
}
