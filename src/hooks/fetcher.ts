// src/hooks/fetcher.ts

export const fetcher = async (key: string[] | string) => {
    let url: string
    let from: string | undefined
    let to: string | undefined
    let event: string | undefined

    if (Array.isArray(key)) {
        url = key[0]
        from = key[1]
        to = key[2]
        event = key[3]
    } else {
        url = key
    }

    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    if (event) params.append('event', event)

    const queryString = params.toString()
    if (queryString) url += `?${queryString}`

    const res = await fetch(url)

    if (!res.ok) {
        const errorData = await res
            .json()
            .catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || 'Failed to fetch data')
    }

    return res.json()
}
