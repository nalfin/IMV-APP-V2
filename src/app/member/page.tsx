import TableOfMembers from '@/app/member/member-table'
import axios from 'axios'

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL

async function getData() {
    const res = await axios.get(`${apiBaseURL}/api/members`)

    if (res.status !== 200) {
        throw new Error(
            `Failed to fetch data: API returned status ${res.status}`
        )
    }

    return res.data
}

const MemberPages = async () => {
    const data = await getData()

    return (
        <>
            <TableOfMembers data={data} />
        </>
    )
}

export default MemberPages
