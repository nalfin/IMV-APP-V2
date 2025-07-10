// app/member/dialog-add-member.tsx
'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
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
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import { Button } from '@/components/atoms/button'
import RadioRole from '@/components/molecules/members/radio-role'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function DialogAddMember({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [hq, setHq] = useState<number | ''>('')
    const [trop, setTrop] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [alertDialogOnConfirm, setAlertDialogOnConfirm] = useState<
        (() => void) | undefined
    >(undefined)

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

    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setAlertDialogOnConfirm(undefined)
        // Jika AlertDialog muncul karena error, dan kita ingin loader tetap
        // muncul sampai dialog error ditutup, maka reset submitStatus di sini.
        // Ini sudah ditangani di onClose prop dari CustomAlertDialog di JSX
    }

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10)
        setHq(isNaN(value) ? '' : value)

        if (value >= 30) setTrop('T10')
        else if (value >= 27) setTrop('T9')
        else if (value >= 24) setTrop('T8')
        else if (value >= 20) setTrop('T7')
        else if (value >= 17) setTrop('T6')
        else setTrop('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !hq || !role || !trop || !status) {
            handleOpenAlertDialog(
                'Input Tidak Lengkap',
                '❌ Semua field harus diisi!'
            )
            // Penting: Jangan set submitStatus ke 'loading' atau 'error' di sini
            // karena ini adalah validasi sisi klien, bukan hasil API.
            return
        }

        setSubmitStatus('loading') // Set status ke 'loading' untuk menampilkan FullScreenLoader

        try {
            const payload = {
                member_name: name,
                hq,
                trop,
                role,
                status
            }

            const res = await fetch(`${API_URL}/api/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (result.success) {
                onSuccess?.()
                setSubmitStatus('success')

                setTimeout(() => {
                    setOpen(false)
                }, 500)

                setTimeout(() => {
                    // Reset form
                    setName('')
                    setHq('')
                    setTrop('')
                    setRole('')
                    setStatus('')
                    setSubmitStatus('idle') // Reset submitStatus ke idle
                }, 1000) // Loader akan tampil sebagai 'success' selama 1 detik, lalu dialog tertutup dan loader hilang
            } else {
                handleOpenAlertDialog(
                    'Gagal Menambah Member',
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
            {/* Ini memastikan loader muncul selama proses, menampilkan 'SUCCESS' sebentar,
                dan tetap muncul saat ada error sampai alert dialog ditutup. */}
            {(submitStatus === 'loading' ||
                submitStatus === 'success' ||
                submitStatus === 'error') && <FullScreenLoader />}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </DialogTrigger>
                <DialogContent className="font-mono sm:max-w-[425px]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Add Member IMV</DialogTitle>
                            <DialogDescription>
                                Tambahkan member baru di Indonesian Mafia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nick Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1 grid gap-3">
                                    <Label htmlFor="hq">Level HQ</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="hq"
                                            name="hq"
                                            type="number"
                                            placeholder="30"
                                            value={hq}
                                            onChange={handleLevelChange}
                                            required
                                        />
                                        <span className="grid h-9 w-16 items-center rounded-md border border-border text-center text-sm">
                                            {hq === '' ? 'T0' : trop}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1 grid gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status}
                                        onValueChange={(value) =>
                                            setStatus(value)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-full">
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
                                className={`w-full ${
                                    submitStatus === 'success'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600'
                                } text-white`}
                                disabled={submitStatus === 'loading'} // Tombol disabled saat loading
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
                                    'SUBMIT'
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
                    // Ini adalah bagian penting: jika AlertDialog ini muncul karena error,
                    // maka reset submitStatus ke 'idle' saat dialog ditutup.
                    if (submitStatus === 'error') {
                        setSubmitStatus('idle')
                    }
                }}
                title={alertDialogTitle}
                description={alertDialogDescription}
                onConfirm={alertDialogOnConfirm}
                isDestructive={submitStatus === 'error'} // Tampilkan sebagai destruktif jika statusnya error
            />
        </>
    )
}
