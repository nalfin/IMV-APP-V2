import { Button } from '@/components/atoms/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const NavCta = () => {
    const { status } = useSession()
    return (
        <>
            {status === 'unauthenticated' && (
                <Button
                    size="default"
                    asChild
                    className="bg-indigo-600 text-foreground hover:bg-indigo-700"
                >
                    <Link href="/auth/login">Login</Link>
                </Button>
            )}
            {status === 'authenticated' && (
                <Button
                    onClick={() => signOut()}
                    className="bg-red-700 text-foreground hover:bg-red-600"
                >
                    Logout
                </Button>
            )}
        </>
    )
}

export default NavCta
