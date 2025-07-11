'use client' // Tambahkan ini karena usePathname adalah hook klien

import Footer from '@/components/templates/footer'
import Header from '@/components/templates/header'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { usePathname } from 'next/navigation' // Import usePathname

type typeAppShell = {
    children: React.ReactNode
}

const AppShell = ({ children }: typeAppShell) => {
    const pathname = usePathname() // Dapatkan jalur URL saat ini

    // Tentukan apakah kita berada di halaman login
    const isLoginPage = pathname === '/auth/login'
    const isRegisterPage = pathname === '/auth/register'

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <main className="container-fluid mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20">
                {!isLoginPage && !isRegisterPage && <Header />}
                {children}
                {!isLoginPage && !isRegisterPage && <Footer />}
            </main>
        </ThemeProvider>
    )
}

export default AppShell
