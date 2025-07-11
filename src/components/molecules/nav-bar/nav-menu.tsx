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
            {/* Pastikan NavigationMenu mengambil lebar penuh dari parent-nya di mobile,
                dan biarkan perilaku default (atau yang didefinisikan oleh komponen itu sendiri) di desktop. */}
            <NavigationMenu className="w-full">
                {/* NavigationMenuList harus lebar penuh di mobile agar item-itemnya bisa meregang.
                    flex-col akan membuat item-item menumpuk vertikal dan w-full akan membuat setiap baris penuh. */}
                <NavigationMenuList className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-4">
                    {[
                        { href: '/member', label: 'Member' },
                        { href: '/vs-da', label: 'VS DA' },
                        { href: '/event', label: 'Event' }
                    ].map((item) => (
                        <NavigationMenuItem
                            key={item.href}
                            // Pastikan setiap NavigationMenuItem mengambil lebar penuh di mode kolom (mobile)
                            className="w-full"
                        >
                            <NavigationMenuLink
                                asChild
                                // Gabungkan 'w-full' di akhir string className.
                                // Ini penting karena `navigationMenuTriggerStyle` mungkin menambahkan `w-max`
                                // dan `w-full` perlu mengesampingkannya.
                                className={`${navigationMenuTriggerStyle({
                                    // Hapus 'min-w-full' dari sini. Cukup atur padding dan perataan teks.
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
