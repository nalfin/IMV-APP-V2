'use client'

import AuthLogo from '@/components/molecules/auth/auth-logo'
import FormRegister from '@/components/molecules/auth/form-register'
import { register } from '@/lib/sheets/service'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const RegisterView = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const { push } = useRouter()

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    const handleRegister = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await register({ username, password })

        if (result.success) {
            e.target.reset()
            setIsLoading(false)
            setIsSuccess(true)
            setTimeout(() => {
                push('/auth/login')
            }, 500)
        } else {
            setIsLoading(false)
            setIsError(result.message)
        }
    }

    // const handleRegister = async (e: any) => {
    //     e.preventDefault()

    //     setIsLoading(true)

    //     const payload = {
    //         username: username,
    //         password: password
    //     }
    //     const result = await fetch('/api/auth/register', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(payload)
    //     })

    //     if (result.status === 200) {
    //         e.target.reset()
    //         setIsLoading(false)
    //         setIsSuccess(true)
    //         setTimeout(() => {
    //             push('/auth/login')
    //         }, 500)
    //     } else {
    //         setIsLoading(false)
    //         setIsError(result.status === 400 ? 'Username sudah ada!' : '')
    //     }
    // }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-8 px-4 font-sans">
            <AuthLogo />
            <FormRegister
                handleRegister={handleRegister}
                handleChange={(e) => setUsername(e.target.value)}
                setUsername={setUsername}
                setPassword={setPassword}
                showPassword={showPassword}
                handleTogglePassword={handleTogglePassword}
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
            />
        </div>
    )
}

export default RegisterView
