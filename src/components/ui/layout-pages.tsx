'use client'

import Footer from '../templates/footer'
import Header from '../templates/header'

const LayoutPages = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="container-fluid mx-auto max-w-[1440px] px-4 md:px-8 lg:px-20">
            <Header />
            {children}
            <Footer />
        </main>
    )
}

export default LayoutPages
