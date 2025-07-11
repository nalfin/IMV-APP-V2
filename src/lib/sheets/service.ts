import { generateCustomId } from '@/lib/sheets/sheet-utils'
import bcrypt from 'bcryptjs'

interface userDataType {
    id: string
    username: string
    password: string
    role: string
    time_stamp: string
}

export async function register(userData: {
    username: string
    password: string
}) {
    const { username, password } = userData

    const getUsers = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`
    )
    const response = await getUsers.json()
    const result: userDataType[] = response
    const user = result.find((row) => row.username === username)

    if (user) {
        return { success: false, message: 'Username sudah ada!' }
    }

    const id = generateCustomId(
        result.map((row) => row.id),
        'USR-IMV-',
        3
    )
    const hashedPassword = await bcrypt.hash(password, 10)
    const payload = {
        id,
        username,
        password: hashedPassword,
        role: 'member',
        time_stamp: new Date().toISOString()
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
    )

    if (res.ok) {
        return { success: true, message: 'Registrasi Berhasil' }
    } else {
        return { success: false, message: 'Registrasi Gagal' }
    }
}

// Fungsi Login
export async function login(userData: { username: string }) {
    const { username } = userData

    const getUsers = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    const response = await getUsers.json()
    const result: userDataType[] = response
    const data = result.find((row) => row.username === username)

    if (data) {
        return data
    } else {
        return null
    }
}
