'use client'

import { useState } from 'react'
import { MemberTableType } from '@/types/member.type'
import { MemberDataTable } from '@/app/member/data-table'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'
import DialogEditMember from '@/components/organisms/members/dialog-edit'
import { DialogBulkEditMembers } from '@/components/organisms/members/dialog-bulk'
import { useSession } from 'next-auth/react'
import { getMemberColumns } from '@/app/member/columns'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function TableOfMembers({
    data,
    onSuccess
}: {
    data: MemberTableType[]
    onSuccess: () => void
}) {
    const [selectedMember, setSelectedMember] =
        useState<MemberTableType | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [showFromLast, setShowFromLast] = useState(false)
    const [openBulkEdit, setOpenBulkEdit] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<MemberTableType[]>(
        []
    )
    // State untuk mengontrol status submit, termasuk saat delete
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    // State dan fungsi untuk CustomAlertDialog (pesan error/sukses)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')

    const handleOpenAlertDialog = (title: string, description: string) => {
        setAlertDialogTitle(title)
        setAlertDialogDescription(description)
        setIsAlertDialogOpen(true)
    }

    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        // Penting: Reset submitStatus ke idle setelah dialog ditutup,
        // jika dialog digunakan untuk menunjukkan status akhir (sukses/error)
        setSubmitStatus('idle')
    }

    const handleDelete = async (id: string) => {
        setSubmitStatus('loading') // Set status ke 'loading' untuk menampilkan FullScreenLoader

        try {
            const res = await fetch(`${API_URL}/api/members/${id}`, {
                method: 'DELETE'
            })

            const result = await res.json()

            if (result.success) {
                onSuccess()
                setSubmitStatus('success') // Set status sukses
                // Opsional: Tampilkan toast/notifikasi sukses singkat sebelum kembali ke idle
                setTimeout(() => {
                    setSubmitStatus('idle') // Kembali ke idle setelah waktu singkat
                }, 500) // Loader akan terlihat selama 0.5 detik setelah mutate selesai
            } else {
                handleOpenAlertDialog(
                    'Gagal Menghapus Anggota',
                    `❌ Gagal: ${result.message || 'Terjadi kesalahan saat menghapus.'}`
                )
                setSubmitStatus('error') // Set status error
            }
        } catch (err: any) {
            console.error('Failed to delete member:', err)
            handleOpenAlertDialog(
                'Gagal Menghapus Anggota',
                `Terjadi kesalahan jaringan atau server: ${err.message || 'Silakan coba lagi.'}`
            )
            setSubmitStatus('error') // Set status error
        }
    }

    const handleBulkEditOpen = (selected: MemberTableType[]) => {
        setSelectedMembers(selected)
        setOpenBulkEdit(true)
    }

    const handleEdit = (member: MemberTableType) => {
        setSelectedMember(member)
        setEditOpen(true)
    }

    const { data: session } = useSession()
    const role = (session?.user as { role: string })?.role ?? 'unknown'

    const columns = getMemberColumns(role, handleEdit, handleDelete)

    return (
        <>
            {/* FullScreenLoader hanya muncul ketika submitStatus adalah 'loading' */}
            {submitStatus === 'loading' && <FullScreenLoader />}

            <div className="grid gap-10">
                <MemberDataTable
                    columns={columns}
                    data={
                        showFromLast ? [...(data || [])].reverse() : data || []
                    }
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    onBulkEditOpen={handleBulkEditOpen}
                    onSuccess={onSuccess}
                />

                {selectedMember && (
                    <DialogEditMember
                        member={selectedMember}
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        onSuccess={onSuccess}
                    />
                )}

                {openBulkEdit && (
                    <DialogBulkEditMembers
                        open={openBulkEdit}
                        onOpenChange={setOpenBulkEdit}
                        selectedMembers={selectedMembers}
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
