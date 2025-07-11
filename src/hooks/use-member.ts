'use client'

import useSWR, { SWRResponse } from 'swr'
import { MemberTableType } from '@/types/member.type' // Pastikan path ini benar

// Definisi fetcher function.
// Ini adalah fungsi yang akan dipanggil oleh useSWR untuk mengambil data.
// Kita bisa membuatnya fleksibel untuk endpoint lain di masa depan.
const fetcher = async (url: string) => {
    const res = await fetch(url, { method: 'GET' })
    const result = await res.json()

    // const res = await axios.get(url)
    // Sesuaikan ini berdasarkan struktur respons API Anda.
    // Jika API mengembalikan { success: true, data: [...] }, maka gunakan res.data.data
    // Jika API langsung mengembalikan array, maka gunakan res.data
    return result.data.data || result.data // Contoh fleksibel
}

// Custom hook untuk mengambil data anggota
export function useMembers(
    initialData?: MemberTableType[]
): SWRResponse<MemberTableType[], Error> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const apiURL = `${API_URL}/api/members`

    return useSWR<MemberTableType[]>(apiURL, fetcher, {
        // Jika initialData diberikan, gunakan sebagai fallbackData.
        // Ini berguna saat data awal disediakan oleh Server Component.
        fallbackData: initialData,
        revalidateOnMount: !initialData, // Revalidasi saat mount hanya jika tidak ada initialData
        revalidateOnFocus: true
        // refreshInterval: 5000, // Opsional: otomatis refresh setiap 5 detik
    })
}
