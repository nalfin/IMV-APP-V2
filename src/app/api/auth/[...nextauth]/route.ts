// src/app/api/auth/[...nextauth]/route.ts (atau lokasi file NextAuth Anda)

import { compare } from 'bcryptjs'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login } from '@/lib/sheets/service'

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string
                    password: string
                }

                const user: any = await login({ username })
                if (user) {
                    const passwordConfirm = await compare(
                        password,
                        user.password
                    )
                    if (passwordConfirm) {
                        return user
                    }
                    return null
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account?.provider === 'credentials' && user) {
                token.id = user.id
                token.username = user.username
                token.name = user.username
                token.role = user.role
            }
            return token
        },
        async session({ session, token }: any) {
            if ('id' in token) {
                session.user.id = token.id
            }
            if ('username' in token) {
                session.user.username = token.username
            }
            if ('name' in token) {
                session.user.name = token.name
            }
            if ('role' in token) {
                session.user.role = token.role
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/login'
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
