import Image from 'next/image'
import Link from 'next/link'

const AuthLogo = () => {
    return (
        <>
            <div className="flex justify-center">
                <Link href="/">
                    <div className="relative -mt-20 flex w-[343px] justify-center">
                        <div className="absolute h-auto w-auto">
                            <Image
                                src="/images/imv-logo.png"
                                alt="Logo Turi Squad"
                                width={80}
                                height={20}
                                priority
                                className="pointer-events-none h-auto w-auto"
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default AuthLogo
