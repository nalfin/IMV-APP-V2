'use client'

import LoginView from '@/components/templates/auth/login'

const LoginPage = ({ searchParams }: any) => {
    return (
        <>
            <LoginView searchParams={searchParams} />
        </>
    )
}

export default LoginPage
