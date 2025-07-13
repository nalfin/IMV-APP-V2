import { handleGetListEvents } from '@/lib/api/events/get-event-list'

export async function GET(request: Request) {
    return handleGetListEvents() // Panggil handler yang sudah diadaptasi
}
