'use client'

import * as React from 'react'
import { SessionProvider } from 'next-auth/react'
import AppShell from '@/components/ui/app-shell' // Pastikan path ini benar
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AppShell>{children}</AppShell>
        </SessionProvider>
    )
}
