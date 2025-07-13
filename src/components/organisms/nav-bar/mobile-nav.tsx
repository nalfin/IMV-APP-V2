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
import NavMenu from '@/components/molecules/nav-bar/nav-menu'
import NavCta from '@/components/molecules/nav-bar/nav-cta'

const MobileNavbar = () => {
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
