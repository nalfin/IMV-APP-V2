import Image from 'next/image'
import Link from 'next/link'

const AppLogo = () => {
    return (
        <>
            <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/images/imv-logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                    priority
                />
            </Link>
        </>
    )
}

export default AppLogo
