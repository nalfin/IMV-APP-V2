import { handleAddEvents } from '@/lib/api/events/add-event'
import { handleGetVsDAEvent } from '@/lib/api/events/get-vsda-event'

export async function GET(request: Request) {
    return handleGetVsDAEvent(request)
}

// Handler untuk POST /api/members
export async function POST(request: Request) {
    return handleAddEvents(request) // Panggil handler yang sudah diadaptasi
}
