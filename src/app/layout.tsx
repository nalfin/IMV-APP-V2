import type { Metadata } from 'next'
import { Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/ui/providers'

const interTightSans = Inter_Tight({
    variable: '--font-sans',
    subsets: ['latin']
})

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'IMV Management',
    description: 'IMV Management Application'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${interTightSans.variable} ${jetBrainsMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
