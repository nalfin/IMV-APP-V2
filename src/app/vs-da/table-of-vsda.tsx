'use client'

import { useMemo, useState } from 'react'
import { MemberDataTable } from '@/app/member/data-table'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'
import DialogEditMember from '@/components/organisms/members/dialog-edit'
import { DialogBulkEditMembers } from '@/components/organisms/members/dialog-bulk'
import { useSession } from 'next-auth/react'
import { getVsDAColumns } from '@/app/vs-da/columns'
import { VsDADataTable } from '@/app/vs-da/data-table'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { VsDATableType } from '@/types/vsda.type'
import DialogEditVsDA from '@/components/organisms/vs-da/dialog-edit'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TableOfVsDA({
    data,
    onSuccess,
    dateRange,
    setDateRange
}: {
    data: VsDATableType[]
    onSuccess: () => void
    dateRange: DateRange | undefined
    setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}) {
    const [selectedVsDA, setSelectedVsDA] = useState<VsDATableType[]>([])
    const [editOpen, setEditOpen] = useState(false)
    const [showDateHeader, setShowDateHeader] = useState<boolean>(false)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [showFromLast, setShowFromLast] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    const handleOpenAlertDialog = (title: string, description: string) => {
        setAlertDialogTitle(title)
        setAlertDialogDescription(description)
        setIsAlertDialogOpen(true)
    }

    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setSubmitStatus('idle')
    }

    const handleEdit = (vsda: VsDATableType) => {
        setSelectedVsDA([vsda])
        setEditOpen(true)
    }

    const handleBulkEdit = (rows: VsDATableType[]) => {
        setSelectedVsDA(rows)
        setEditOpen(true)
    }

    const { data: session } = useSession()
    const role = (session?.user as { role: string })?.role ?? 'unknown'

    const startDate = dateRange?.from ?? new Date(2025, 5, 23)
    const endDate = dateRange?.to ?? new Date(2025, 5, 28)

    const columns = getVsDAColumns(
        role,
        handleEdit,
        startDate,
        endDate,
        showDateHeader
    )

    return (
        <>
            {/* FullScreenLoader hanya muncul ketika submitStatus adalah 'loading' */}
            {submitStatus === 'loading' && <FullScreenLoader />}

            <div className="grid gap-10">
                <VsDADataTable
                    data={showFromLast ? [...data].reverse() : data}
                    columns={columns}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    showDateHeader={showDateHeader}
                    setShowDateHeader={setShowDateHeader}
                    onBulkEditOpen={handleBulkEdit}
                    onSuccess={onSuccess}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />

                {selectedVsDA.length > 0 && (
                    <DialogEditVsDA
                        allDataVsDA={data}
                        selectedDataVsDA={selectedVsDA}
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        onSuccess={onSuccess}
                    />
                )}
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
