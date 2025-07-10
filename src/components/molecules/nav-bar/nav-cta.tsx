import { Button } from '@/components/atoms/button'
import Link from 'next/link'

const NavCta = () => {
    return (
        <>
            <Button size="default" asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
        </>
    )
}

export default NavCta
