'use client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/atoms/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/button'
import NavMenu from '@/components/molecules/nav-bar/nav-menu'
import NavCta from '@/components/molecules/nav-bar/nav-cta'

const MobileNavbar = () => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const status = localStorage.getItem('isLoggedIn')
        setIsLoggedIn(status === 'true')
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('username')
        localStorage.clear()

        setIsLoggedIn(false)
        router.push('/login')
    }

    if (isLoggedIn === null) return null
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
                <SheetHeader>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-10 flex flex-col gap-10">
                    <NavMenu />
                    <NavCta />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavbar
