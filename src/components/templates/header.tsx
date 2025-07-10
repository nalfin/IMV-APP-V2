import NavLogo from '@/components/molecules/nav-bar/nav-logo'
import DesktopNavbar from '@/components/organisms/nav-bar/desktop-navbar'
import MobileNavbar from '@/components/organisms/nav-bar/mobile-nav'

const Header = () => {
    return (
        <>
            <header className="mb-8 border-b border-border">
                <div className="flex h-20 items-center justify-between">
                    <NavLogo />
                    <div className="hidden lg:block">
                        <DesktopNavbar />
                    </div>
                    <div className="md:hidden">
                        <MobileNavbar />
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
