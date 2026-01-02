'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
    totalVillas: number
    activeBookings: number
    monthRevenue: number
    pendingInquiries: number
}

interface Booking {
    id: string
    guest_name: string
    villa_id: string
    check_in: string
    status: string
}

interface Villa {
    id: string
    name: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalVillas: 0,
        activeBookings: 0,
        monthRevenue: 0,
        pendingInquiries: 0
    })
    const [recentBookings, setRecentBookings] = useState<Booking[]>([])
    const [villas, setVillas] = useState<Record<string, Villa>>({})
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true)

                // Fetch total villas
                const { count: villasCount } = await supabase
                    .from('villas')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'published')

                // Fetch active bookings (confirmed or pending)
                const { count: bookingsCount } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true })
                    .in('status', ['confirmed', 'pending'])

                // Fetch this month's revenue
                const firstDayOfMonth = new Date()
                firstDayOfMonth.setDate(1)
                firstDayOfMonth.setHours(0, 0, 0, 0)

                const { data: monthBookings } = await supabase
                    .from('bookings')
                    .select('total_price')
                    .gte('created_at', firstDayOfMonth.toISOString())
                    .in('status', ['confirmed', 'completed'])

                const monthRevenue = monthBookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0

                // Fetch pending inquiries
                const { count: pendingCount } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')

                setStats({
                    totalVillas: villasCount || 0,
                    activeBookings: bookingsCount || 0,
                    monthRevenue: monthRevenue,
                    pendingInquiries: pendingCount || 0
                })

                // Fetch recent bookings
                const { data: bookingsData } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3)

                setRecentBookings(bookingsData || [])

                // Fetch villa names
                if (bookingsData && bookingsData.length > 0) {
                    const villaIds = [...new Set(bookingsData.map(b => b.villa_id))]
                    const { data: villasData } = await supabase
                        .from('villas')
                        .select('id, name')
                        .in('id', villaIds)

                    if (villasData) {
                        const villasMap: Record<string, Villa> = {}
                        villasData.forEach(v => {
                            villasMap[v.id] = v
                        })
                        setVillas(villasMap)
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [supabase])

    const statsDisplay = [
        { name: 'Total Villas', value: loading ? '...' : stats.totalVillas.toString(), change: '', icon: '🏠', color: 'bg-safari-olive' },
        { name: 'Active Bookings', value: loading ? '...' : stats.activeBookings.toString(), change: '', icon: '📅', color: 'bg-accent-maasai' },
        { name: 'This Month Revenue', value: loading ? '...' : `KES ${(stats.monthRevenue / 1000).toFixed(0)}K`, change: '', icon: '💰', color: 'bg-accent-kenya' },
        { name: 'Pending Inquiries', value: loading ? '...' : stats.pendingInquiries.toString(), change: '', icon: '💬', color: 'bg-safari-stone' },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-safari-night">Welcome back!</h1>
                <p className="text-neutral-600 mt-1">Here&apos;s what&apos;s happening with your villas today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsDisplay.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg ${stat.color} text-white text-2xl`}>
                                {stat.icon}
                            </div>
                            {stat.change && (
                                <span className="text-accent-kenya text-sm font-medium">
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <h3 className="mt-4 text-2xl font-bold text-safari-night">{stat.value}</h3>
                        <p className="text-sm text-neutral-600">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/villas"
                    className="bg-safari-olive text-white p-6 rounded-lg hover:bg-safari-sand transition-colors text-center"
                >
                    <div className="text-3xl mb-2">🏠</div>
                    <h3 className="font-bold text-lg">Manage Villas</h3>
                    <p className="text-sm opacity-90 mt-1">View and edit villa listings</p>
                </Link>
                <Link
                    href="/admin/bookings"
                    className="bg-accent-maasai text-white p-6 rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                    <div className="text-3xl mb-2">📅</div>
                    <h3 className="font-bold text-lg">View Bookings</h3>
                    <p className="text-sm opacity-90 mt-1">Manage reservations</p>
                </Link>
                <Link
                    href="/admin/media"
                    className="bg-accent-kenya text-white p-6 rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                    <div className="text-3xl mb-2">🖼️</div>
                    <h3 className="font-bold text-lg">Media Library</h3>
                    <p className="text-sm opacity-90 mt-1">Upload and organize images</p>
                </Link>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-xl font-bold text-safari-night">Recent Bookings</h2>
                </div>
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-neutral-600">Loading bookings...</p>
                    </div>
                ) : recentBookings.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                        No bookings yet. Start receiving reservations!
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                            Guest
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                            Villa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                            Check-in
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4 text-sm font-medium text-safari-night">
                                                {booking.guest_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {villas[booking.villa_id]?.name || 'Unknown Villa'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {new Date(booking.check_in).toLocaleDateString('en-US')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'confirmed'
                                                    ? 'bg-accent-kenya/10 text-accent-kenya'
                                                    : 'bg-accent-maasai/10 text-accent-maasai'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/admin/bookings/${booking.id}`}
                                                    className="text-safari-olive hover:text-safari-sand font-medium"
                                                >
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-200">
                            <Link
                                href="/admin/bookings"
                                className="text-safari-olive hover:text-safari-sand font-medium text-sm"
                            >
                                View all bookings →
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
