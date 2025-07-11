'use client'

import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/atoms/dialog'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { MemberTableType } from '@/types/member.type'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import useSWR from 'swr'
import { fetcher } from '@/hooks/fetcher'
import FormAddEvents from '@/components/molecules/events/form-add'

interface DialogAddEventsProps {
    onSuccess: () => void
}

export function DialogAddEvents({ onSuccess }: DialogAddEventsProps) {
    const [eventName, setEventName] = useState('')
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success'
    >('idle')
    const [open, setOpen] = useState(false)
    const [hqStart, setHqStart] = useState<number>(0)
    const [hqEnd, setHqEnd] = useState<number>(0)
    const [filteredNames, setFilteredNames] = useState<string[]>([])

    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members`,
        fetcher
    )

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitStatus('loading')

        if (!eventName.trim()) {
            alert('Nama event harus diisi.')
            setSubmitStatus('idle')
            return
        }

        if (hqStart === 0 || hqEnd === 0 || hqStart > hqEnd) {
            alert('Mohon masukkan range HQ level yang valid.')
            setSubmitStatus('idle')
            return
        }

        const filtered = data.filter(
            (member: MemberTableType) =>
                member.hq >= hqStart && member.hq <= hqEnd
        )

        const payloadMembers = filtered.map((m: MemberTableType) => ({
            id: m.id,
            member_name: m.member_name,
            hq: m.hq
        }))

        const eventsPayload = {
            payloadMembers,
            eventName
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventsPayload)
            }
        )

        const result = await res.json()

        if (result.success) {
            onSuccess()
            setFilteredNames(
                filtered.map((m: MemberTableType) => m.member_name)
            )
            setSubmitStatus('success')

            setTimeout(() => {
                setOpen(false)
            }, 500)

            setTimeout(() => {
                setEventName('')
                setHqStart(0)
                setHqEnd(0)
                setFilteredNames([])
                setSubmitStatus('idle')
            }, 1000)
        } else {
            alert(result.message || 'Gagal menyimpan event.')
            setSubmitStatus('idle')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle /> Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <FormAddEvents
                    eventName={eventName}
                    setEventName={setEventName}
                    submitStatus={submitStatus}
                    hqStart={hqStart}
                    setHqStart={setHqStart}
                    hqEnd={hqEnd}
                    setHqEnd={setHqEnd}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}
