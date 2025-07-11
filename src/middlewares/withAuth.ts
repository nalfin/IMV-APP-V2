import { getToken } from 'next-auth/jwt'
import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse
} from 'next/server'

// Halaman yang hanya boleh diakses oleh role tertentu (admin/member)
const onlyAdminPages = ['/member', '/vs-da', '/event']

export default function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname = req.nextUrl.pathname

        // Cek apakah path yang sekarang termasuk dalam daftar yang butuh auth
        const isProtectedRoute = requireAuth.some((path) =>
            pathname.startsWith(path)
        )

        if (isProtectedRoute) {
            const token = await getToken({
                req,
                secret: process.env.NEXTAUTH_SECRET
            })

            // Jika belum login, redirect ke halaman login
            if (!token) {
                const url = new URL('/auth/login', req.url)
                url.searchParams.set('callbackUrl', encodeURI(req.url))
                return NextResponse.redirect(url)
            }

            // Validasi role: hanya admin/member yang bisa akses halaman tertentu
            const isOnlyAdminPage = onlyAdminPages.some((path) =>
                pathname.startsWith(path)
            )

            if (
                token.role !== 'admin' &&
                token.role !== 'member' &&
                isOnlyAdminPage
            ) {
                // Kalau role tidak sesuai, redirect ke halaman utama
                return NextResponse.redirect(new URL('/', req.url))
            }
        }

        return middleware(req, next)
    }
}
