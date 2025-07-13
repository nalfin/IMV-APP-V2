'use client'

import { Button } from '@/components/atoms/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/atoms/dialog'
import { useState } from 'react'
import { format } from 'date-fns'
import RadioVsDA from '@/components/molecules/vs-da/radio-vs-da'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DatePickerForm } from '@/components/molecules/vs-da/date-picker-form'
import { VsDATableType } from '@/types/vsda.type'
import { FullScreenLoader } from '@/components/ui/fullscreen-loader'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/atoms/alert-dialog'

interface VsDAEditProps {
    allDataVsDA: VsDATableType[]
    selectedDataVsDA: VsDATableType[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const DialogEditVsDA = ({
    allDataVsDA,
    selectedDataVsDA,
    open,
    onOpenChange,
    onSuccess
}: VsDAEditProps) => {
    const [selectedPoin, setSelectedPoin] = useState<string>('')
    const [selectedTanggal, setSelectedTanggal] = useState<Date | undefined>()

    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')
    const [progress, setProgress] = useState(0)

    const totalItems = selectedDataVsDA.length

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [alertDialogTitle, setAlertDialogTitle] = useState('')
    const [alertDialogDescription, setAlertDialogDescription] = useState('')
    const [alertDialogOnConfirmAction, setAlertDialogOnConfirmAction] =
        useState<(() => void) | undefined>(undefined)

    const handleOpenAlertDialog = (
        title: string,
        description: string,
        onConfirm?: () => void
    ) => {
        setAlertDialogTitle(title)
        setAlertDialogDescription(description)
        setAlertDialogOnConfirmAction(() => onConfirm)
        setIsAlertDialogOpen(true)
    }

    const handleCloseAlertDialog = () => {
        setIsAlertDialogOpen(false)
        setAlertDialogTitle('')
        setAlertDialogDescription('')
        setAlertDialogOnConfirmAction(undefined)
        if (submitStatus === 'error') {
            setSubmitStatus('idle')
        }
    }

    const handleUpdateVsDA = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedTanggal || !selectedPoin) {
            handleOpenAlertDialog(
                'Input Tidak Lengkap',
                '❌ Semua field harus diisi!'
            )
            return
        }

        setSubmitStatus('loading')
        setProgress(0)

        try {
            const payloads = selectedDataVsDA.map((member) => ({
                id: member.id,
                tanggal: format(selectedTanggal, 'dd/M/yy'),
                value_point: selectedPoin
            }))

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/vsda`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloads)
                }
            )

            const result = await res.json()

            if (result.success) {
                setSubmitStatus('success')
                let successCount = 0
                let failedCount = 0
                let failureMessages: string[] = []

                if (result.details && Array.isArray(result.details)) {
                    result.details.forEach((detail: any) => {
                        if (detail.status === 'success') {
                            successCount++
                        } else {
                            failedCount++
                            if (detail.message) {
                                failureMessages.push(
                                    `ID ${detail.id}: ${detail.message}`
                                )
                            }
                        }
                    })
                }

                setProgress(successCount)

                if (failedCount > 0) {
                    // Tampilkan alert jika ada yang gagal
                    handleOpenAlertDialog(
                        'Update Selesai dengan Peringatan',
                        `✅ Berhasil memperbarui ${successCount} dari ${totalItems} entri. ❌ Gagal memperbarui ${failedCount} entri. Detail: ${failureMessages.join('; ')}`,
                        () => {
                            onOpenChange(false)
                            onSuccess?.()
                            setSubmitStatus('idle')
                            setSelectedPoin('')
                            setSelectedTanggal(undefined)
                        }
                    )
                } else {
                    // Jika semua berhasil, tidak tampilkan alert, langsung tutup dialog dan reset
                    onSuccess?.()
                    setSubmitStatus('success')

                    setTimeout(() => {
                        onOpenChange(false)
                    }, 500)

                    setTimeout(() => {
                        setSubmitStatus('idle')
                    }, 1000)

                    // setSelectedPoin('')
                    // setSelectedTanggal(undefined)
                    // Tidak ada handleOpenAlertDialog di sini
                }
            } else {
                // Ini adalah case jika seluruh operasi backend gagal
                handleOpenAlertDialog(
                    'Gagal Mengupdate Poin',
                    `❌ Gagal: ${result.message || 'Terjadi kesalahan tidak diketahui.'}`
                )
                setSubmitStatus('error')
            }
        } catch (err: any) {
            console.error(err)
            handleOpenAlertDialog(
                'Terjadi Kesalahan Jaringan',
                `⚠️ Terjadi masalah koneksi atau server: ${err.message || 'Silakan coba lagi.'}`
            )
            setSubmitStatus('error')
        } finally {
            // Cleanup jika diperlukan, tapi submitStatus sudah mengelola sebagian besar
        }
    }

    const selectedDateFormatted = selectedTanggal
        ? format(selectedTanggal, 'yyyy-MM-dd')
        : ''

    const jumlahTerisi = allDataVsDA.filter((v) =>
        v.data_point_da?.some(
            (p) => p.date === selectedDateFormatted && p.value !== ''
        )
    ).length

    const renderButtonText = () => {
        if (submitStatus === 'success') return 'SUCCESS'
        if (submitStatus === 'loading')
            return (
                <div className="flex items-center space-x-1">
                    <LoadingSpinner className="size-4" />
                    <span>
                        LOADING ... ({progress}/{totalItems})
                    </span>
                </div>
            )
        return 'UPDATE'
    }

    return (
        <>
            {submitStatus === 'loading' && <FullScreenLoader />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="font-mono sm:max-w-[550px]">
                    <form className="space-y-6" onSubmit={handleUpdateVsDA}>
                        <DialogHeader className="text-left">
                            <DialogTitle>Edit Poin DA</DialogTitle>
                            <DialogDescription>
                                Ubah data poin VS DA member Indonesian Mafia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <DatePickerForm
                                value={selectedTanggal}
                                onChange={setSelectedTanggal}
                            />
                            <div className="rounded-sm border border-border bg-input/30 p-4">
                                <RadioVsDA
                                    value={selectedPoin}
                                    onChange={setSelectedPoin}
                                />
                            </div>
                            <div className="grid gap-3 rounded-sm border border-border bg-input/30 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Daftar nama yang diedit poinnya:
                                    </p>

                                    <span className="rounded-sm border border-border px-3 py-2 text-xs">
                                        {jumlahTerisi}/{allDataVsDA.length}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground">
                                    {(Array.isArray(selectedDataVsDA)
                                        ? selectedDataVsDA
                                        : [selectedDataVsDA]
                                    )
                                        .map((v) => v.member_name)
                                        .join(', ')}
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="mt-3">
                            <Button
                                type="submit"
                                className={`w-full text-white transition-all duration-300 hover:brightness-110 ${submitStatus === 'success' ? 'bg-green-600' : 'bg-indigo-500 hover:bg-indigo-600'} `}
                                disabled={submitStatus === 'loading'}
                            >
                                {renderButtonText()}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={isAlertDialogOpen}
                onOpenChange={setIsAlertDialogOpen}
            >
                <AlertDialogContent className="font-mono">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertDialogDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                handleCloseAlertDialog()
                                alertDialogOnConfirmAction?.()
                            }}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DialogEditVsDA
