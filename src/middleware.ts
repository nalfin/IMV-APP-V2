import withAuth from '@/middlewares/withAuth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function mainMiddleware(req: NextRequest) {
    return NextResponse.next()
}

// Jalankan middleware hanya pada halaman yang perlu auth (admin/member)
export default withAuth(mainMiddleware, ['/member', '/vs-da', '/event'])

export const config = {
    matcher: ['/member/:path*', '/vs-da/:path*', '/event/:path*']
}
