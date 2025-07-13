// src/app/vs-da/page.tsx
'use client'

import { FullScreenLoader } from '@/components/ui/fullscreen-loader' // Opsional, jika mau ada loader saat CSR loading
import dynamic from 'next/dynamic' // Import dynamic dari next/dynamic

// Impor ClientTableWrapper secara dinamis dengan ssr: false
const DynamicClientTableWrapper = dynamic(
    () => import('@/components/organisms/vs-da/client-table-wrapper'),
    {
        ssr: false, // INI KUNCI UTAMANYA: KOMPONEN INI HANYA DIRENDER DI SISI CLIENT
        loading: () => <FullScreenLoader /> // Tampilkan loader sementara saat komponen dimuat
    }
)

const VsDAPages = () => {
    return (
        <>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Dashboard VS DA</h1>
                {/* Gunakan komponen yang diimpor secara dinamis */}
                <DynamicClientTableWrapper />
            </div>
        </>
    )
}

export default VsDAPages
