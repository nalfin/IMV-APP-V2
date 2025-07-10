import NavCta from '@/components/molecules/nav-bar/nav-cta'
import NavMenu from '@/components/molecules/nav-bar/nav-menu'

const DesktopNavbar = () => {
    return (
        <>
            <div className="flex items-center gap-10">
                <NavMenu />
                <NavCta />
            </div>
        </>
    )
}

export default DesktopNavbar
