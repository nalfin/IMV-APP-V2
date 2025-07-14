'use client'

import { useMemo, useState } from 'react'
import { MemberDataTable } from '@/app/member/data-table'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'
import { useSession } from 'next-auth/react'
// import { getEventColumns } from '@/app/vs-da/columns'
// import { EventDataTable } from '@/app/vs-da/data-table'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import DialogEditEvent from '@/components/organisms/vs-da/dialog-edit'
import { EventTableType } from '@/types/event.type'
import { getEventColumns } from '@/app/event/columns'
import { EventDataTable } from '@/app/event/data-table'
import { constructFromSymbol } from 'date-fns/constants'

export default function TableOfEvent({
    data,
    dateRange,
    setDateRange
}: {
    data: EventTableType[]
    onSuccess: () => void
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
    const [selectedEvent, setSelectedEvent] = useState<EventTableType[]>([])
    const [editOpen, setEditOpen] = useState(false)
    const [showDateHeader, setShowDateHeader] = useState<boolean>(false)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [showFromLast, setShowFromLast] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setSubmitStatus('idle')
    }

    const startDate = dateRange?.from ?? new Date(2025, 5, 23)
    const endDate = dateRange?.to ?? new Date(2025, 5, 28)

    const columns = getEventColumns(startDate, endDate, showDateHeader)

    return (
        <>
            {/* FullScreenLoader hanya muncul ketika submitStatus adalah 'loading' */}
            {submitStatus === 'loading' && <FullScreenLoader />}

            <div className="grid gap-10">
                <EventDataTable
                    data={showFromLast ? [...data].reverse() : data}
                    columns={columns}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    showDateHeader={showDateHeader}
                    setShowDateHeader={setShowDateHeader}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>

            {/* Custom AlertDialog untuk pesan error/sukses (jika tidak ada toast) */}
            <CustomAlertDialog
                isOpen={isAlertDialogOpen}
                onClose={handleCloseAlertDialog}
                title={alertDialogTitle}
                description={alertDialogDescription}
                confirmText="Oke"
                // isDestructive={submitStatus === 'error'} // Opsional: Berikan warna merah jika error
            />
        </>
    )
}
