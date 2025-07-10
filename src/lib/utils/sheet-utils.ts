/**
 * Memvalidasi apakah ID spreadsheet Google Sheets telah didefinisikan.
 * Fungsi ini memastikan bahwa variabel lingkungan GOOGLE_SHEET_ID tidak kosong.
 * @param {string | undefined} spreadsheetId - ID spreadsheet yang diambil dari variabel lingkungan.
 * @returns {string | null} Pesan error jika ID tidak valid atau tidak ditemukan, atau null jika valid.
 */
export function validateSheetID(
    spreadsheetId: string | undefined
): string | null {
    if (!spreadsheetId) {
        return 'Google Sheet ID is not defined in environment variables.'
    }
    // Anda dapat menambahkan validasi format ID spreadsheet di sini jika diperlukan
    // Misalnya, menggunakan regex untuk memastikan ID sesuai dengan pola ID Google Sheet.
    return null // Mengembalikan null jika valid
}

/**
 * Menghasilkan ID kustom baru yang unik berdasarkan prefix dan panjang padding.
 * Fungsi ini akan mencoba membuat ID numerik berurutan dan memastikan ID tersebut belum ada
 * dalam daftar ID yang sudah ada.
 * @param {string[]} existingIds - Array string ID yang sudah ada di spreadsheet.
 * @param {string} prefix - Prefix yang akan digunakan untuk ID baru (contoh: 'MBR-IMV-').
 * @param {number} paddingLength - Panjang padding numerik (contoh: 3 akan menghasilkan '001', '002').
 * @returns {string} ID kustom yang unik.
 */
export function generateCustomId(
    existingIds: string[],
    prefix: string,
    paddingLength: number
): string {
    let newIdNum = 1 // Mulai dari angka 1
    let newId: string

    // Loop untuk mencari ID unik yang belum ada
    do {
        // Format angka dengan padding nol di depan sesuai panjang yang ditentukan
        const paddedNum = newIdNum.toString().padStart(paddingLength, '0')
        newId = `${prefix}${paddedNum}` // Gabungkan prefix dengan angka yang sudah di-padding
        newIdNum++ // Tingkatkan angka untuk iterasi berikutnya
    } while (existingIds.includes(newId)) // Lanjutkan loop jika ID yang dihasilkan sudah ada

    return newId // Mengembalikan ID unik yang ditemukan
}
