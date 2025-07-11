import { handleAddEvents } from '@/lib/api/events/add-event'
import { handleGetListEvents } from '@/lib/api/events/get-event-list'

export async function GET(request: Request) {
    return handleGetListEvents() // Panggil handler yang sudah diadaptasi
}

// Handler untuk POST /api/members
export async function POST(request: Request) {
    return handleAddEvents(request) // Panggil handler yang sudah diadaptasi
}
