import { google } from 'googleapis'

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

// Objek autentikasi JWT akan diinisialisasi sekali dan digunakan kembali (singleton pattern)
let jwtClient: any

async function authorize() {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error(
            'Missing Google Sheets API credentials in environment variables.'
        )
    }

    if (!jwtClient) {
        jwtClient = new google.auth.JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })

        await jwtClient.authorize()
    }
    return jwtClient
}

export async function getSheetsClient() {
    const auth = await authorize()
    return google.sheets({ version: 'v4', auth })
}
