import { google } from 'googleapis'

// Kredensial diambil dari variabel lingkungan.
// Pastikan variabel-variabel ini didefinisikan di file .env.local Anda.
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
// Private key perlu diproses karena seringkali mengandung newline characters yang di-escape (\n)
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

// Objek autentikasi JWT akan diinisialisasi sekali dan digunakan kembali (singleton pattern)
let jwtClient: any

/**
 * Menginisialisasi atau mendapatkan instance JWT client untuk autentikasi Google Sheets API.
 * Kredensial diambil dari variabel lingkungan.
 * @returns {Promise<any>} Instance JWT client yang telah diautentikasi.
 * @throws {Error} Jika kredensial Google Sheets API tidak ditemukan.
 */
async function authorize() {
    // Memastikan kredensial tersedia sebelum mencoba mengautentikasi
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error(
            'Missing Google Sheets API credentials in environment variables.'
        )
    }

    // Hanya inisialisasi JWT client jika belum ada
    if (!jwtClient) {
        jwtClient = new google.auth.JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })

        // Melakukan autentikasi client
        await jwtClient.authorize()
    }
    return jwtClient
}

/**
 * Mendapatkan instance Google Sheets client yang telah diautentikasi.
 * Ini adalah fungsi utama yang akan dipanggil oleh handler API Anda.
 * @returns {Promise<google.sheets_v4.Sheets>} Instance Google Sheets API client (v4).
 */
export async function getSheetsClient() {
    const auth = await authorize() // Mendapatkan client yang sudah diautentikasi
    return google.sheets({ version: 'v4', auth }) // Mengembalikan instance Sheets API
}
