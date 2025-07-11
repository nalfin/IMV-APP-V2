import { handleAddUser } from '@/lib/api/auth/add-user'

export async function POST(request: Request) {
    return handleAddUser(request)
}
