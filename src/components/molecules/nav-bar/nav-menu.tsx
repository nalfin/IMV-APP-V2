import Link from 'next/link'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/atoms/navigation-menu'

const NavMenu = () => {
    return (
        <>
            <NavigationMenu className="w-full">
                <NavigationMenuList className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-4">
                    {[
                        { href: '/member', label: 'Member' },
                        { href: '/vs-da', label: 'VS DA' },
                        { href: '/event', label: 'Event' }
                    ].map((item) => (
                        <NavigationMenuItem key={item.href} className="w-full">
                            <NavigationMenuLink
                                asChild
                                className={`${navigationMenuTriggerStyle({
                                    className: 'px-4 py-1.5 text-left'
                                })} w-full`}
                            >
                                <Link href={item.href}>{item.label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    )
}

export default NavMenu
