import { getToken } from 'next-auth/jwt'
import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse
} from 'next/server'

const onlyAdminPages = ['/member', '/vs-da', '/event']

export default function withAuth(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname = req.nextUrl.pathname

        const isProtectedRoute = requireAuth.some((path) =>
            pathname.startsWith(path)
        )

        if (isProtectedRoute) {
            const token = await getToken({
                req,
                secret: process.env.NEXTAUTH_SECRET
            })

            if (!token) {
                const url = new URL('/auth/login', req.url)
                url.searchParams.set('callbackUrl', encodeURI(req.url))
                return NextResponse.redirect(url)
            }

            const isOnlyAdminPage = onlyAdminPages.some((path) =>
                pathname.startsWith(path)
            )

            if (
                token.role !== 'admin' &&
                token.role !== 'member' &&
                isOnlyAdminPage
            ) {
                return NextResponse.redirect(new URL('/', req.url))
            }
        }

        return middleware(req, next)
    }
}
