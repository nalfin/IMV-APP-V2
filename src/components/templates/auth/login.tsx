'use client'

import AuthLogo from '@/components/molecules/auth/auth-logo'
import FormLogin from '@/components/molecules/auth/form-login'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const LoginView = ({ searchParams }: any) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const { push } = useRouter()

    const callbackUrl = searchParams.callbackUrl || '/'

    const handleLogin = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await signIn('credentials', {
                redirect: false,
                username: username,
                password: password,
                callbackUrl
            })

            if (!res?.error) {
                setIsLoading(false)
                push(callbackUrl)
            } else {
                setIsLoading(false)
                setIsError('Username atau password salah!')
            }
        } catch (err: any) {
            console.error(err)
            setIsLoading(false)
            setIsError('Username atau password salah!')
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
