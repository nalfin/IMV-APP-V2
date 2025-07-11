'use client'

import TableOfMembers from '@/app/member/member-table'
import CardMemberSummary from '@/components/organisms/members/card-summary'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { fetcher } from '@/hooks/fetcher'
import useSWR from 'swr'

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
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Dashboard Member</h1>
                <CardMemberSummary />
                <TableOfMembers data={data || []} onSuccess={handleFetchData} />
            </div>
        </>
    )
}

export default MemberPages
