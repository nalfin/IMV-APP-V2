import { useSession } from 'next-auth/react'
import AppLogo from './app-logo'

const NavLogo = () => {
    const { data: session, status } = useSession()
    return (
        <>
            <div className="flex items-center gap-3">
                <AppLogo />
                {status === 'authenticated' && (
                    <span className="hidden font-semibold capitalize md:block">
                        Hi👋 {session?.user?.name}
                    </span>
                )}
            </div>
        </>
    )
}

export default NavLogo
