// app/member/dialog-bulk-edit-members.tsx
'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/atoms/dialog'
import { Label } from '@/components/atoms/label'

import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog' // Pastikan path ini benar
import { MemberTableType } from '@/types/member.type'
import RadioRole from '@/components/molecules/members/radio-role'
import RadioStatus from '@/components/molecules/members/radio-status'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedMembers: MemberTableType[]
    onSuccess: () => void
}

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export function DialogBulkEditMembers({
    open,
    onOpenChange,
    selectedMembers,
    onSuccess
}: Props) {
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')

    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')
    const [progress, setProgress] = useState(0)

    // State untuk AlertDialog (digunakan untuk validasi, sukses, dan error)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [alertDialogOnConfirm, setAlertDialogOnConfirm] = useState<
        (() => void) | undefined
    >(undefined)
    const [isAlertDialogDestructive, setIsAlertDialogDestructive] =
        useState(false) // New state for destructive alert style

    // Function to open AlertDialog
    const handleOpenAlertDialog = (
        title: string,
        description: string,
        onConfirm?: () => void,
        isDestructive: boolean = false // Default to non-destructive
    ) => {
        setAlertDialogTitle(title)
        setAlertDialogDescription(description)
        setAlertDialogOnConfirm(() => onConfirm)
        setIsAlertDialogDestructive(isDestructive) // Set destructive style
        setIsAlertDialogOpen(true)
    }

    // Function to close AlertDialog
    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setAlertDialogOnConfirm(undefined)
        setIsAlertDialogDestructive(false) // Reset destructive style
        // Only reset submitStatus if it was an error, to allow success loader to finish
        if (submitStatus === 'error') {
            setSubmitStatus('idle')
        }
    }

    // Reset form states when dialog opens or selectedMembers change
    useEffect(() => {
        if (open) {
            setRole('')
            setStatus('')
            setSubmitStatus('idle')
            setProgress(0)
        }
    }, [open, selectedMembers])

    const handleBulkUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!role && !status) {
            handleOpenAlertDialog(
                'Input Tidak Lengkap',
                '❌ Role atau Status harus diisi salah satu!',
                undefined, // No confirm action for this alert
                false // Not destructive
            )
            return
        }

        if (selectedMembers.length === 0) {
            handleOpenAlertDialog(
                'Tidak Ada Member Terpilih',
                'Silakan pilih setidaknya satu member untuk diupdate.',
                undefined,
                false
            )
            return
        }

        setSubmitStatus('loading')
        setProgress(0)

        let successfulUpdates = 0
        const totalMembers = selectedMembers.length

        for (let i = 0; i < totalMembers; i++) {
            const memberToUpdate = selectedMembers[i]
            setProgress(i + 1)

            try {
                const updateUrl = `${apiBaseURL}/api/members/${memberToUpdate.id}`

                const payload = {
                    id: memberToUpdate.id,
                    member_name: memberToUpdate.member_name,
                    hq: memberToUpdate.hq,
                    trop: memberToUpdate.trop,
                    role: role ? role : memberToUpdate.role,
                    status: status ? status : memberToUpdate.status
                }

                const response = await axios.put(updateUrl, payload)
                const result = response.data

                if (result.success) {
                    successfulUpdates++
                } else {
                    console.error(
                        `❌ Gagal mengupdate ${memberToUpdate.member_name}: ${result.message || 'Unknown error'}`
                    )
                }
            } catch (error: any) {
                console.error(
                    `❌ Error updating ${memberToUpdate.member_name}:`,
                    error
                )
            }
        }

        if (successfulUpdates === totalMembers) {
            setSubmitStatus('success')
            onSuccess()

            setTimeout(() => {
                onOpenChange(false)
                setProgress(0)
            }, 500)

            setTimeout(() => {
                setSubmitStatus('idle')
            }, 1000)
        } else if (successfulUpdates > 0) {
            handleOpenAlertDialog(
                'Update Selesai dengan Beberapa Kesalahan',
                `✅ Berhasil mengupdate ${successfulUpdates} dari ${totalMembers} member. Beberapa mungkin gagal. Periksa konsol untuk detail.`,
                undefined,
                true // Destructive because of partial failure
            )
            setSubmitStatus('error')
            onSuccess()
        } else {
            handleOpenAlertDialog(
                'Gagal Melakukan Bulk Update',
                `❌ Gagal mengupdate semua ${totalMembers} member. Periksa konsol untuk detail.`,
                undefined,
                true // Destructive because of full failure
            )
            setSubmitStatus('error')
        }
    }

    // --- NEW: handleBulkDelete function ---
    const handleBulkDelete = async () => {
        if (selectedMembers.length === 0) {
            handleOpenAlertDialog(
                'Tidak Ada Member Terpilih',
                'Silakan pilih setidaknya satu member untuk dihapus.',
                undefined,
                false
            )
            return
        }

        // Show confirmation dialog first
        handleOpenAlertDialog(
            'Konfirmasi Penghapusan Massal',
            `Apakah Anda yakin ingin menghapus ${selectedMembers.length} member yang dipilih? Aksi ini tidak dapat dibatalkan.`,
            async () => {
                // This is the onConfirm action
                setSubmitStatus('loading') // Start loading for delete
                setProgress(0) // Reset progress for delete

                let successfulDeletes = 0
                const totalMembersToDelete = selectedMembers.length

                for (let i = 0; i < totalMembersToDelete; i++) {
                    const memberToDelete = selectedMembers[i]
                    setProgress(i + 1) // Update progress

                    try {
                        const deleteUrl = `${apiBaseURL}/api/members/${memberToDelete.id}`

                        const response = await axios.delete(deleteUrl)
                        const result = response.data

                        if (result.success) {
                            successfulDeletes++
                        } else {
                            console.error(
                                `❌ Failed to delete ${memberToDelete.member_name}: ${result.message || 'Unknown error'}`
                            )
                        }
                    } catch (error: any) {
                        console.error(
                            `❌ Error deleting ${memberToDelete.member_name}:`,
                            error
                        )
                    }
                }

                // After all delete attempts
                if (successfulDeletes === totalMembersToDelete) {
                    setSubmitStatus('success')
                    onSuccess() // Trigger data refresh in parent

                    setTimeout(() => {
                        onOpenChange(false) // Close the bulk edit dialog
                        setProgress(0)
                    }, 500)

                    setTimeout(() => {
                        setSubmitStatus('idle') // Hide FullScreenLoader
                    }, 1000)
                } else if (successfulDeletes > 0) {
                    // Partial success
                    handleOpenAlertDialog(
                        'Penghapusan Selesai dengan Beberapa Kesalahan',
                        `✅ Berhasil menghapus ${successfulDeletes} dari ${totalMembersToDelete} member. Beberapa mungkin gagal. Periksa konsol untuk detail.`,
                        undefined,
                        true // Destructive because of partial failure
                    )
                    setSubmitStatus('error') // Loader remains until alert dismissed
                    onSuccess() // Still trigger refresh
                } else {
                    // All failed
                    handleOpenAlertDialog(
                        'Gagal Melakukan Penghapusan Massal',
                        `❌ Gagal menghapus semua ${totalMembersToDelete} member. Periksa konsol untuk detail.`,
                        undefined,
                        true // Destructive because of full failure
                    )
                    setSubmitStatus('error') // Loader remains until alert dismissed
                }
            },
            true // Make this confirmation dialog destructive
        )
    }

    return (
        <>
            {/* FullScreenLoader appears when loading, success, or error */}
            {(submitStatus === 'loading' ||
                submitStatus === 'success' ||
                submitStatus === 'error') && <FullScreenLoader />}

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="font-mono sm:max-w-[425px]">
                    <form onSubmit={handleBulkUpdate} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Edit Selected Members</DialogTitle>
                            <DialogDescription>
                                Update hanya Role dan Status member yang
                                dipilih.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            {selectedMembers.length > 0 && (
                                <div className="grid gap-2 rounded-sm border border-border bg-input/30 p-4 text-sm">
                                    <p className="text-sm text-muted-foreground">
                                        Daftar member ({selectedMembers.length}
                                        ):
                                    </p>
                                    <p className="max-h-24 overflow-y-auto text-sm text-foreground">
                                        {selectedMembers
                                            .map((m) => m.member_name)
                                            .join(', ')}
                                    </p>
                                </div>
                            )}
                            {selectedMembers.length === 0 && open && (
                                <p className="text-red-500">
                                    Tidak ada member yang dipilih. Harap pilih
                                    member dari tabel.
                                </p>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="role">Role</Label>
                                <div className="rounded-sm border border-border bg-input/30 p-3">
                                    <RadioRole
                                        value={role}
                                        onChange={setRole}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="status">Status</Label>
                                <div className="rounded-sm border border-border bg-input/30 p-3">
                                    <RadioStatus
                                        value={status}
                                        onChange={setStatus}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <div className="grid w-full gap-4">
                                <Button
                                    type="submit"
                                    disabled={
                                        submitStatus === 'loading' ||
                                        selectedMembers.length === 0 ||
                                        (!role && !status) // Disable if no role or status is selected for update
                                    }
                                    className={`w-full text-white sm:w-auto ${
                                        submitStatus === 'success'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-indigo-500 hover:bg-indigo-600'
                                    }`}
                                >
                                    {submitStatus === 'loading' &&
                                    !alertDialogOnConfirm ? ( // Show loader only if updating
                                        <div className="flex items-center justify-center space-x-1">
                                            <LoadingSpinner className="size-4" />
                                            <span className="loading-dots">
                                                LOADING
                                            </span>{' '}
                                            <span>
                                                ({progress}/
                                                {selectedMembers.length})
                                            </span>
                                        </div>
                                    ) : submitStatus === 'success' ? (
                                        <span>SUCCESS</span>
                                    ) : (
                                        'UPDATE'
                                    )}
                                </Button>
                                <Button
                                    type="button" // Important: type="button" to prevent form submission
                                    variant="destructive" // Red style for delete
                                    onClick={handleBulkDelete}
                                    disabled={
                                        submitStatus === 'loading' ||
                                        selectedMembers.length === 0
                                    }
                                    className="mb-2 w-full sm:mb-0 sm:w-auto" // Full width on small, auto on larger
                                >
                                    {submitStatus === 'loading' &&
                                    alertDialogOnConfirm ? ( // Show loader only if deleting
                                        <div className="flex items-center justify-center space-x-1">
                                            <LoadingSpinner className="size-4" />
                                            <span className="loading-dots">
                                                DELETING
                                            </span>{' '}
                                            <span>
                                                ({progress}/
                                                {selectedMembers.length})
                                            </span>
                                        </div>
                                    ) : (
                                        'Delete Selected'
                                    )}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Custom AlertDialog for alerts */}
            <CustomAlertDialog
                isOpen={isAlertDialogOpen}
                onClose={handleCloseAlertDialog}
                title={alertDialogTitle}
                description={alertDialogDescription}
                onConfirm={alertDialogOnConfirm} // This will be the delete action if confirmed
                isDestructive={isAlertDialogDestructive} // Use the new state for destructive style
            />
        </>
    )
}
