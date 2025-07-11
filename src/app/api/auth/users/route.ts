import { handleGetUsers } from '@/lib/api/auth/get-user'

export async function GET(request: Request) {
    return handleGetUsers()
}
