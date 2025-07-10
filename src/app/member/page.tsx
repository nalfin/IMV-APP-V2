// app/member/page.js
'use client' // <--- Ini yang paling penting!

import { useState, useEffect } from 'react'
import TableOfMembers from '@/app/member/member-table'
import axios from 'axios'
import { MemberTableType } from '@/types/member.type'

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const MemberPages = () => {
    const [data, setData] = useState<MemberTableType[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Anda bisa menambahkan console.log di sini untuk debugging di browser:
                // console.log("Fetching data from:", `${apiBaseURL}/api/members`);
                const res = await axios.get(`${apiBaseURL}/api/members`)

                if (res.status !== 200) {
                    throw new Error(
                        `Failed to fetch data: API returned status ${res.status}`
                    )
                }
                setData(res.data)
            } catch (err: unknown) {
                console.error('Error fetching data:', err)
                setError(err as Error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, []) // Array kosong memastikan ini hanya berjalan sekali setelah mount pertama

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold">Memuat data anggota...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center text-red-600">
                <p className="text-xl font-bold">Terjadi Kesalahan!</p>
                <p className="text-md">{error.message}</p>
                <p className="mt-2 text-sm">
                    Pastikan API berjalan dan URL benar.
                </p>
            </div>
        )
    }

    return (
        <>
            <TableOfMembers data={data} />
        </>
    )
}

export default MemberPages
