// src/app/api/auth/[...nextauth]/route.ts (atau lokasi file NextAuth Anda)

import { compare } from 'bcryptjs'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { handleGetUsers } from '@/lib/api/auth/get-user' // Import fungsi untuk mendapatkan semua user

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET, // Pastikan NEXTAUTH_SECRET ada di .env.local
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
                // Hapus 'name' jika tidak digunakan untuk otentikasi
                // name: { label: 'Name', type: 'text' }
            },
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string
                    password: string
                }

                try {
                    // 1. Ambil semua user dari Google Sheet
                    const usersResponse = await handleGetUsers()

                    if (!usersResponse.ok) {
                        const errorBody = await usersResponse.json()
                        console.error(
                            'Error fetching users for NextAuth:',
                            errorBody.message
                        )
                        throw new Error(
                            errorBody.message || 'Failed to retrieve user data.'
                        )
                    }

                    const usersData = await usersResponse.json()

                    // Pastikan usersData adalah array
                    if (!Array.isArray(usersData)) {
                        console.error(
                            'handleGetUsers did not return an array of users:',
                            usersData
                        )
                        throw new Error(
                            'Unexpected user data format from authentication source.'
                        )
                    }

                    // 2. Cari user berdasarkan username
                    // Perhatikan: properti 'name' di objek user dari handleGetUsers adalah username
                    // Dan properti 'pasword' (dengan satu 's') adalah password hash
                    const user = usersData.find((u: any) => u.name === username)

                    if (!user) {
                        throw new Error('Username atau password salah.') // Pesan umum untuk keamanan
                    }

                    // 3. Bandingkan password yang diberikan dengan hash password yang tersimpan
                    const isPasswordValid = await compare(
                        password,
                        user.pasword
                    ) // 'pasword' adalah hash yang tersimpan

                    if (!isPasswordValid) {
                        throw new Error('Username atau password salah.') // Pesan umum untuk keamanan
                    }

                    // 4. Jika valid, kembalikan objek user.
                    // NextAuth akan menyimpan ini di token JWT dan session.
                    // Pastikan properti yang Anda butuhkan ada di sini (id, username, role).
                    // NextAuth secara default mencari 'id', 'name', 'email'.
                    // Anda bisa memetakan 'username' ke 'name' jika ingin mengikuti konvensi NextAuth.
                    return {
                        id: user.id, // ID unik pengguna
                        name: user.name, // Nama pengguna (username)
                        role: user.role // Peran pengguna
                        // Anda bisa menambahkan properti lain yang relevan di sini
                    }
                } catch (error: any) {
                    console.error('Authorization error:', error.message)
                    // Penting: Throw error agar NextAuth tahu otentikasi gagal.
                    // Pesan ini akan ditampilkan di UI login jika Anda menggunakan error prop dari signIn.
                    throw new Error(
                        error.message || 'Terjadi kesalahan saat login.'
                    )
                }
            }
        })
    ],
    callbacks: {
        // Callback JWT: Menambahkan properti kustom ke token JWT
        async jwt({ token, user, account }: any) {
            if (account?.provider === 'credentials' && user) {
                // 'user' di sini adalah objek yang dikembalikan dari authorize()
                token.id = user.id
                token.username = user.name // Menggunakan 'name' dari objek user yang dikembalikan
                token.role = user.role
            }
            return token
        },
        // Callback Session: Mengubah objek session yang akan tersedia di sisi klien
        async session({ session, token }: any) {
            // 'token' di sini adalah objek yang dikembalikan dari callback jwt()
            if (token) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.role = token.role
            }
            return session
        }
    }
    // pages: {
    //     signIn: '/auth/login' // Opsional: arahkan ke halaman login kustom Anda
    // }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
