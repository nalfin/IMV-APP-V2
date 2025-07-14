'use client'

import { useRef } from 'react'
import TableOfMembers from '@/app/member/table-of-member'
import CardMemberSummary from '@/components/organisms/members/card-summary'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { fetcher } from '@/hooks/fetcher'
import useSWR from 'swr'

const MemberPages = () => {
    const {
        data: membersData,
        isLoading: isLoadingMembers,
        mutate: mutateMembers
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/members`, fetcher)

    // Ini akan menampung fungsi update summary
    const summaryUpdaterRef = useRef<() => void>()

    const handleFetchData = () => {
        mutateMembers()
        summaryUpdaterRef.current?.() // panggil update summary juga
    }

    return (
        <>
            {isLoadingMembers && <FullScreenLoader />}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Dashboard Member</h1>

                <CardMemberSummary
                    onExposeUpdate={(fn) => {
                        summaryUpdaterRef.current = fn
                    }}
                />

                <TableOfMembers
                    data={membersData || []}
                    onSuccess={handleFetchData}
                />
            </div>
        </>
    )
}

export default MemberPages
