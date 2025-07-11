'use client'

import LoginView from '@/components/templates/auth/login'
import { Suspense } from 'react'

const LoginPage = () => {
    return (
        <>
            <Suspense>
                <LoginView />
            </Suspense>
        </>
    )
}

export default LoginPage
