'use client'

import TableOfMembers from '@/app/member/member-table'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import useSWR from 'swr'

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch members')
        }
        return res.json()
    })

const MemberPages = () => {
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members`,
        fetcher
    )

    const handleFetchData = () => {
        mutate()
    }
    return (
        <>
            {isLoading && <FullScreenLoader />}
            <div>
                <TableOfMembers data={data || []} onSuccess={handleFetchData} />
            </div>
        </>
    )
}

export default MemberPages
