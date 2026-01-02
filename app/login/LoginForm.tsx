'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient, isAllowedAdminEmail } from '@/lib/supabase/auth-client'

type AuthState = 'idle' | 'sending' | 'sent' | 'verifying' | 'error'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [authState, setAuthState] = useState<AuthState>('idle')
    const [error, setError] = useState('')
    const supabase = createClient()

    // Check for auth errors from callback
    useEffect(() => {
        if (searchParams.get('error') === 'auth_error') {
            setError('Authentication failed. Please try again.')
            setAuthState('error')
        }
    }, [searchParams])

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email is allowed
        if (!isAllowedAdminEmail(email)) {
            setError('This email is not authorized to access the admin panel.')
            setAuthState('error')
            return
        }

        setAuthState('sending')

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // Don't create a magic link - only send OTP code
                    shouldCreateUser: true,
                },
            })

            if (error) {
                setError(error.message)
                setAuthState('error')
            } else {
                setAuthState('sent')
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            setAuthState('error')
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setAuthState('verifying')

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            })

            if (error) {
                setError(error.message)
                setAuthState('sent') // Stay on code entry screen
            } else {
                // Redirect to admin on success
                window.location.href = '/admin'
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            setAuthState('sent')
        }
    }

    const resetForm = () => {
        setAuthState('idle')
        setError('')
        setEmail('')
        setOtp('')
    }

    const resendCode = async () => {
        setError('')
        setAuthState('sending')

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            })

            if (error) {
                setError(error.message)
                setAuthState('sent')
            } else {
                setAuthState('sent')
                setOtp('')
            }
        } catch (err) {
            setError('Failed to resend code. Please try again.')
            setAuthState('sent')
        }
    }

    // Code entry state - OTP sent
    if (authState === 'sent' || authState === 'verifying') {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-safari-night mb-2">
                            Lifestyle Villas
                        </h1>
                        <p className="text-safari-olive font-medium">Admin Portal</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="w-16 h-16 bg-safari-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-safari-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-safari-night mb-2 text-center">Enter Verification Code</h2>
                        <p className="text-neutral-600 mb-6 text-center">
                            We&apos;ve sent an 8-digit code to<br />
                            <span className="font-medium text-safari-night">{email}</span>
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-safari-night mb-1">
                                    Verification Code
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={8}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    disabled={authState === 'verifying'}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono bg-neutral-100 text-safari-night placeholder-neutral-400"
                                    placeholder="00000000"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={authState === 'verifying' || otp.length !== 8}
                                className="w-full bg-safari-olive text-white py-2.5 rounded-lg font-medium hover:bg-safari-sand transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {authState === 'verifying' ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col items-center gap-3">
                            <button
                                onClick={resendCode}
                                disabled={authState === 'verifying'}
                                className="text-safari-olive hover:text-safari-sand font-medium transition-colors disabled:opacity-50"
                            >
                                Resend Code
                            </button>
                            <button
                                onClick={resetForm}
                                disabled={authState === 'verifying'}
                                className="text-neutral-500 hover:text-neutral-700 text-sm transition-colors disabled:opacity-50"
                            >
                                Use a different email
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-6 text-sm text-neutral-500">
                        © {new Date().getFullYear()} Lifestyle Villas Nanyuki
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-safari-night mb-2">
                        Lifestyle Villas
                    </h1>
                    <p className="text-safari-olive font-medium">Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-safari-night mb-2">Sign In</h2>
                    <p className="text-neutral-600 mb-6">
                        Enter your email to receive a verification code
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-safari-night mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={authState === 'sending'}
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-neutral-100 text-safari-night placeholder-neutral-400"
                                placeholder="your@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={authState === 'sending'}
                            className="w-full bg-safari-olive text-white py-2.5 rounded-lg font-medium hover:bg-safari-sand transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {authState === 'sending' ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Code...
                                </>
                            ) : (
                                'Send Verification Code'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500 text-center">
                            <span className="block mb-1">🔐 Secure Code Authentication</span>
                            An 8-digit code will be sent to your email
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-sm text-neutral-500">
                    © {new Date().getFullYear()} Lifestyle Villas Nanyuki
                </p>
            </div>
        </div>
    )
}
