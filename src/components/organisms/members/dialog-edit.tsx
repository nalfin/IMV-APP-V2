// app/member/dialog-edit-member.tsx
'use client'

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
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/atoms/select'
import { MemberTableType } from '@/types/member.type'
import axios from 'axios'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import RadioRole from '@/components/molecules/members/radio-role'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog' // Pastikan path ini benar

export default function DialogEditMember({
    member,
    open,
    onOpenChange,
    onSuccess
}: {
    member: MemberTableType
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}) {
    // State untuk data form
    const [nama, setNama] = useState(member.member_name)
    const [hq, setHq] = useState<number>(member.hq)
    const [trop, setTrop] = useState(member.trop)
    const [role, setRole] = useState(member.role)
    const [status, setStatus] = useState(member.status)

    // State untuk status submit (menggantikan isSubmit dan isSuccess)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    // State untuk AlertDialog
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [alertDialogOnConfirm, setAlertDialogOnConfirm] = useState<
        (() => void) | undefined
    >(undefined)

    // Fungsi untuk membuka AlertDialog
    const handleOpenAlertDialog = (
        title: string,
        description: string,
        onConfirm?: () => void
    ) => {
        setAlertDialogTitle(title)
        setAlertDialogDescription(description)
        setAlertDialogOnConfirm(() => onConfirm)
        setIsAlertDialogOpen(true)
    }

    // Fungsi untuk menutup AlertDialog
    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setAlertDialogOnConfirm(undefined)
        // Reset submitStatus ke idle jika AlertDialog ini muncul karena error
        if (submitStatus === 'error') {
            setSubmitStatus('idle')
        }
    }

    const updateTropFromLevel = (level: number) => {
        if (level >= 30) return 'T10'
        if (level >= 27) return 'T9'
        if (level >= 24) return 'T8'
        if (level >= 20) return 'T7'
        if (level >= 17) return 'T6'
        return 'T5'
    }

    const handleHqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) {
            setHq(value)
            setTrop(updateTropFromLevel(value))
        } else {
            setHq(0)
            setTrop('')
        }
    }

    // Efek untuk mereset form saat member prop berubah (misal, dialog dibuka untuk member lain)
    useEffect(() => {
        if (member) {
            setNama(member.member_name)
            setHq(member.hq)
            setTrop(member.trop)
            setRole(member.role)
            setStatus(member.status)
            setSubmitStatus('idle') // Reset status submit saat member baru dipilih/dialog dibuka
        }
    }, [member])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nama || !hq || !role || !trop || !status) {
            handleOpenAlertDialog(
                'Input Tidak Lengkap',
                '❌ Semua field harus diisi!'
            )
            return
        }

        setSubmitStatus('loading') // Mulai loading untuk menampilkan FullScreenLoader

        try {
            const apiBaseURL =
                process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VERCEL_URL

            const payload = {
                id: member.id,
                member_name: nama,
                hq,
                role,
                trop,
                status
            }

            const response = await axios.put(
                `${apiBaseURL}/api/members/${member.id}`,
                payload
            )

            const result = response.data

            if (result.success) {
                onSuccess?.()
                setSubmitStatus('success')

                setTimeout(() => {
                    onOpenChange(false)
                }, 500)

                setTimeout(() => {
                    setSubmitStatus('idle')
                }, 1000)
            } else {
                handleOpenAlertDialog(
                    'Gagal Mengupdate Member',
                    `❌ Gagal: ${result.message || 'Terjadi kesalahan tidak diketahui.'}`
                )
                setSubmitStatus('error') // Set status ke 'error'
            }
        } catch (err: any) {
            console.error('❌ ERROR:', err)
            handleOpenAlertDialog(
                'Kesalahan Koneksi',
                'Terjadi kesalahan koneksi: ' +
                    (err.message || 'Silakan coba lagi.')
            )
            setSubmitStatus('error') // Set status ke 'error'
        }
        // Tidak perlu 'finally' di sini karena penanganan status 'idle' sudah diatur
        // di setTimeout untuk sukses dan di onClose AlertDialog untuk error.
    }

    return (
        <>
            {/* FullScreenLoader hanya muncul saat submitStatus adalah 'loading', 'success', atau 'error' */}
            {(submitStatus === 'loading' ||
                submitStatus === 'success' ||
                submitStatus === 'error') && <FullScreenLoader />}

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="font-mono sm:max-w-[425px]">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Edit Member</DialogTitle>
                            <DialogDescription>
                                Ubah data member Indonesian Mafia
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="hq">Level HQ</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="hq"
                                            type="number"
                                            value={hq}
                                            onChange={handleHqChange}
                                            required
                                        />
                                        <span className="grid h-9 w-16 items-center rounded-md border border-border text-center text-sm">
                                            {trop}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status}
                                        onValueChange={(
                                            value: 'ACTIVE' | 'INACTIVE'
                                        ) => setStatus(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">
                                                ACTIVE
                                            </SelectItem>
                                            <SelectItem value="INACTIVE">
                                                INACTIVE
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="role">Role</Label>
                                <div className="rounded-sm border border-border bg-input/30 p-3">
                                    <RadioRole
                                        value={role}
                                        onChange={setRole}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-3">
                            <Button
                                type="submit"
                                disabled={submitStatus === 'loading'} // Tombol disabled saat loading
                                className={`w-full text-white ${
                                    submitStatus === 'success'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600'
                                }`}
                            >
                                {submitStatus === 'loading' ? (
                                    <div className="flex items-center space-x-1">
                                        <LoadingSpinner className="size-4" />
                                        <span className="loading-dots">
                                            LOADING
                                        </span>
                                    </div>
                                ) : submitStatus === 'success' ? (
                                    <span>SUCCESS</span>
                                ) : (
                                    'UPDATE'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Custom AlertDialog untuk menggantikan alert() */}
            <CustomAlertDialog
                isOpen={isAlertDialogOpen}
                onClose={() => {
                    handleCloseAlertDialog()
                }}
                title={alertDialogTitle}
                description={alertDialogDescription}
                onConfirm={alertDialogOnConfirm}
                isDestructive={submitStatus === 'error'} // Tampilkan sebagai destruktif jika statusnya error
            />
        </>
    )
}
