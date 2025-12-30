'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/auth-client'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Villas', href: '/admin/villas', icon: '🏠' },
    { name: 'Bookings', href: '/admin/bookings', icon: '📅' },
    { name: 'Media', href: '/admin/media', icon: '🖼️' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const supabase = createClient()

    const handleSignOut = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-safari-night text-white rounded-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-safari-night text-white
          transform transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo */}
                <div className="px-6 py-8 border-b border-safari-olive/20">
                    <h1 className="text-2xl font-serif font-bold">Lifestyle Villas</h1>
                    <p className="text-safari-sand text-sm mt-1">Admin Portal</p>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-safari-olive text-white'
                                        : 'text-neutral-300 hover:bg-safari-olive/20 hover:text-white'
                                    }
                `}
                            >
                                <span className="text-xl mr-3">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-safari-olive/20">
                    <button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-2 bg-accent-maasai text-white rounded-lg hover:bg-accent-maasai/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoggingOut ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing Out...
                            </>
                        ) : (
                            'Sign Out'
                        )}
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
