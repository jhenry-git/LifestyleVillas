'use client'

import Link from 'next/link'

const stats = [
    { name: 'Total Villas', value: '3', change: '+1', icon: '🏠', color: 'bg-safari-olive' },
    { name: 'Active Bookings', value: '12', change: '+3', icon: '📅', color: 'bg-accent-maasai' },
    { name: 'This Month Revenue', value: 'KES 450K', change: '+12%', icon: '💰', color: 'bg-accent-kenya' },
    { name: 'Pending Inquiries', value: '5', change: '+2', icon: '💬', color: 'bg-safari-stone' },
]

const recentBookings = [
    { id: 1, guest: 'Sarah Johnson', villa: 'Villa 01', checkIn: '2025-01-15', status: 'confirmed' },
    { id: 2, guest: 'David Martinez', villa: 'Villa 02', checkIn: '2025-01-20', status: 'pending' },
    { id: 3, guest: 'Emma Wilson', villa: 'Villa 03', checkIn: '2025-01-25', status: 'confirmed' },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-safari-night">Welcome back!</h1>
                <p className="text-neutral-600 mt-1">Here&apos;s what&apos;s happening with your villas today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg ${stat.color} text-white text-2xl`}>
                                {stat.icon}
                            </div>
                            <span className="text-accent-kenya text-sm font-medium">
                                {stat.change}
                            </span>
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
                                        {booking.guest}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">
                                        {booking.villa}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">
                                        {new Date(booking.checkIn).toLocaleDateString()}
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
            </div>
        </div>
    )
}
