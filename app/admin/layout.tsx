import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'

async function getUser() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Ignore - called from Server Component
                    }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <AdminSidebar />

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-neutral-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-safari-night">
                            Admin Dashboard
                        </h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-neutral-600">
                                {user.email}
                            </span>
                            <span className="text-sm text-neutral-400">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
