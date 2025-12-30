'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient, isAllowedAdminEmail } from '@/lib/supabase/auth-client'

type AuthState = 'idle' | 'sending' | 'sent' | 'error'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
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

    const handleSubmit = async (e: React.FormEvent) => {
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
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
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

    const resetForm = () => {
        setAuthState('idle')
        setError('')
        setEmail('')
    }

    // Success state - magic link sent
    if (authState === 'sent') {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-safari-night mb-2">
                            Lifestyle Villas
                        </h1>
                        <p className="text-safari-olive font-medium">Admin Portal</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-safari-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-safari-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-safari-night mb-2">Check Your Email</h2>
                        <p className="text-neutral-600 mb-4">
                            We've sent a magic link to<br />
                            <span className="font-medium text-safari-night">{email}</span>
                        </p>
                        <p className="text-sm text-neutral-500 mb-6">
                            Click the link in the email to sign in. The link will expire in 1 hour.
                        </p>
                        <button
                            onClick={resetForm}
                            className="text-safari-olive hover:text-safari-sand font-medium transition-colors"
                        >
                            Use a different email
                        </button>
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
                        Enter your email to receive a magic link
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="lifestylevillasbnb@gmail.com"
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
                                    Sending Magic Link...
                                </>
                            ) : (
                                'Send Magic Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500 text-center">
                            <span className="block mb-1">🔐 Passwordless Authentication</span>
                            A secure link will be sent to your email
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
