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
            <NavigationMenu>
                <NavigationMenuList className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-4">
                    {[
                        { href: '/member', label: 'Member' },
                        { href: '/vs-da', label: 'VS DA' },
                        { href: '/event', label: 'Event' }
                    ].map((item) => (
                        <NavigationMenuItem key={item.href}>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle({
                                    className: 'w-full px-2 py-1.5 text-left'
                                })}
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
