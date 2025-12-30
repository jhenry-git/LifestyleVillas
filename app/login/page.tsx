'use client'

import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-safari-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-safari-night">Loading...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
