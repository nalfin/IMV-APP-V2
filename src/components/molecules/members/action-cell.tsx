// Path file ActionCell Anda (misal: components/member/action-cell.tsx)
'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/atoms/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { MemberTableType } from '@/types/member.type'
import CustomAlertDialog from '@/components/molecules/custom-alert-dialog'

interface ActionCellProps {
    member: MemberTableType
    onEdit: (member: MemberTableType) => void
    onDelete: (id: string) => Promise<void> // onDelete dari TableOfMembers
}

export function ActionCell({ member, onEdit, onDelete }: ActionCellProps) {
    const [isDeleting, setIsDeleting] = useState(false) // State untuk menunjukkan proses penghapusan (untuk loader)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // State untuk mengontrol visibilitas dialog

    const handleConfirmDelete = async () => {
        setIsDeleting(true) // Set loading saat memulai proses penghapusan
        try {
            await onDelete(member.id) // Panggil fungsi onDelete dari prop (yang akan memanggil mutate di useSWR)
            setIsDeleteDialogOpen(false) // Tutup dialog setelah berhasil
        } catch (error) {
            console.error('Failed to delete member:', error)
            // Opsional: Tampilkan pesan error ke pengguna
        } finally {
            setIsDeleting(false) // Hentikan loading, terlepas dari sukses/gagal
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-mono">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() =>
                        navigator.clipboard.writeText(member.member_name)
                    }
                >
                    Copy Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(member)}>
                    Edit Member
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)} // Buka dialog konfirmasi saat klik hapus
                    className="text-red-600 focus:text-red-700"
                    disabled={isDeleting} // Nonaktifkan jika sedang dalam proses hapus
                >
                    Hapus Member
                </DropdownMenuItem>
            </DropdownMenuContent>

            {/* Custom Alert Dialog untuk konfirmasi penghapusan */}
            <CustomAlertDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)} // Menutup dialog
                onConfirm={handleConfirmDelete} // Fungsi yang dipanggil saat konfirmasi
                title="Konfirmasi Penghapusan"
                description={`Apakah Anda yakin ingin menghapus anggota ${member.member_name}? Aksi ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                cancelText="Batal"
                isDestructive={true} // Untuk styling tombol merah
                isConfirming={isDeleting} // Teruskan state loading ke dialog
            />
        </DropdownMenu>
    )
}
