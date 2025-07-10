'use client'

import axios from 'axios'
import { useState } from 'react'
import { getColumns } from './columns'
import { MemberTableType } from '@/types/member.type'
import { MemberDataTable } from '@/app/member/data-table'
import { useMembers } from '@/hooks/use-member' // Pastikan path ini benar
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'
import DialogEditMember from '@/components/organisms/members/dialog-edit'
import { DialogBulkEditMembers } from '@/components/organisms/members/dialog-bulk'

export default function TableOfMembers({
    data: initialData
}: {
    data: MemberTableType[]
}) {
    const { data, error, mutate } = useMembers(initialData)

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
            const apiBaseUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL
            const apiUrl = `${apiBaseUrl}/api/members`
            const result = await axios.delete(`${apiUrl}/${id}`)

            if (result.data.success) {
                await mutate() // Tunggu sampai mutate selesai merevalidasi data
                setSubmitStatus('success') // Set status sukses
                // Opsional: Tampilkan toast/notifikasi sukses singkat sebelum kembali ke idle
                setTimeout(() => {
                    setSubmitStatus('idle') // Kembali ke idle setelah waktu singkat
                }, 500) // Loader akan terlihat selama 0.5 detik setelah mutate selesai
            } else {
                handleOpenAlertDialog(
                    'Gagal Menghapus Anggota',
                    `❌ Gagal: ${result.data.message || 'Terjadi kesalahan saat menghapus.'}`
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

    const handleSuccessFetchData = () => {
        mutate()
    }

    const handleBulkEditOpen = (selected: MemberTableType[]) => {
        setSelectedMembers(selected)
        setOpenBulkEdit(true)
    }

    const handleEdit = (member: MemberTableType) => {
        setSelectedMember(member)
        setEditOpen(true)
    }

    const columns = getColumns(handleEdit, handleDelete)

    // Jika data belum ada (initial load) dan ada error, tampilkan pesan error
    if (error && !data) {
        // Memastikan error hanya saat data benar-benar tidak ada
        return (
            <div className="text-red-500">
                Error loading members: {error.message}
            </div>
        )
    }

    if (!data) {
        return <div>No members found.</div>
    }

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
                    onSuccess={handleSuccessFetchData}
                />

                {selectedMember && (
                    <DialogEditMember
                        member={selectedMember}
                        open={editOpen}
                        onOpenChange={setEditOpen}
                        onSuccess={handleSuccessFetchData}
                    />
                )}

                {openBulkEdit && (
                    <DialogBulkEditMembers
                        open={openBulkEdit}
                        onOpenChange={setOpenBulkEdit}
                        selectedMembers={selectedMembers}
                        onSuccess={handleSuccessFetchData}
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
