'use client'

import AuthLogo from '@/components/molecules/auth/auth-logo'
import FormLogin from '@/components/molecules/auth/form-login'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const LoginView = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    // Mengambil callbackUrl dari searchParams
    // Ini adalah URL yang awalnya diminta oleh pengguna sebelum diarahkan ke halaman login
    const callbackUrl: string = searchParams.get('callbackUrl') || '/'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        setIsError('') // Reset error state on new attempt

        try {
            const res = await signIn('credentials', {
                redirect: false, // next-auth akan mengembalikan objek result, bukan melakukan redirect otomatis
                username: username,
                password: password,
                callbackUrl // Ini diteruskan ke next-auth agar ia tahu ke mana harus mengarahkan jika redirect: true
            })

            if (!res?.error) {
                setIsLoading(false)
                router.push(res?.url || callbackUrl)
            } else {
                setIsLoading(false)
                setIsError('Username atau password salah!')
                console.error('Login error:', res?.error) // Log error untuk debugging
            }
        } catch (err: any) {
            console.error('Catch block error:', err)
            setIsLoading(false)
            setIsError('Terjadi kesalahan saat login. Silakan coba lagi.')
        }
    }

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value)
            setIsError('')
        }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-8 px-4 font-sans">
            <AuthLogo />
            <FormLogin
                handleLogin={handleLogin}
                handleTogglePassword={handleTogglePassword}
                handleChange={handleChange}
                username={username}
                password={password}
                showPassword={showPassword}
                isLoading={isLoading}
                isError={isError}
                isSuccess={isSuccess}
                setUsername={setUsername}
                setPassword={setPassword}
            />
        </div>
    )
}

export default LoginView
