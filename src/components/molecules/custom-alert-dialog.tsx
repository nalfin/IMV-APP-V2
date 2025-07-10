// components/atoms/alert-dialog.tsx (atau di mana pun file CustomAlertDialog Anda berada)
'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/atoms/alert-dialog' // Ini adalah komponen dari shadcn/ui
import React from 'react'
import { Loader2 } from 'lucide-react' // Import Loader2 dari lucide-react

interface CustomAlertDialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description: string
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
    isConfirming?: boolean // <<< TAMBAHKAN INI UNTUK LOADING STATE PADA TOMBOL KONFIRMASI
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Batal',
    isDestructive = false,
    isConfirming = false // <<< DEFAULT VALUE
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="font-mono">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {onConfirm && ( // Tombol batal hanya jika ada onConfirm
                        <AlertDialogCancel
                            onClick={onClose}
                            disabled={isConfirming}
                        >
                            {cancelText}
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        onClick={() => {
                            if (onConfirm) {
                                onConfirm()
                            }
                            // Jangan tutup dialog secara otomatis di sini
                            // Biarkan onConfirm menangani penutupan jika perlu, atau
                            // state parent yang mengontrol isOpen
                        }}
                        disabled={isConfirming} // Disable tombol saat loading
                        className={
                            isDestructive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : ''
                        }
                    >
                        {isConfirming ? ( // Tampilkan loader jika sedang mengkonfirmasi
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {confirmText}...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CustomAlertDialog
