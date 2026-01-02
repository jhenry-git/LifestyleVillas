'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Booking {
    id: string
    villa_id: string
    guest_name: string
    guest_email: string
    guest_phone: string | null
    check_in: string
    check_out: string
    guests: number
    nights: number
    total_price: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    booking_reference: string
    created_at: string
}

interface Villa {
    id: string
    name: string
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [villas, setVillas] = useState<Record<string, Villa>>({})
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            let query = supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter)
            }

            if (searchTerm) {
                query = query.or(`guest_name.ilike.%${searchTerm}%,guest_email.ilike.%${searchTerm}%,booking_reference.ilike.%${searchTerm}%`)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError

            setBookings(data || [])

            // Fetch villa names
            if (data && data.length > 0) {
                const villaIds = [...new Set(data.map(b => b.villa_id))]
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
        } catch (err) {
            console.error('Error fetching bookings:', err)
            setError(err instanceof Error ? err.message : 'Failed to load bookings')
        } finally {
            setLoading(false)
        }
    }, [statusFilter, searchTerm, supabase])

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId)

            if (updateError) throw updateError

            fetchBookings()
        } catch (err) {
            console.error('Error updating booking status:', err)
            alert('Failed to update booking status')
        }
    }

    const handleDelete = async (id: string, reference: string) => {
        if (!confirm(`Are you sure you want to delete booking ${reference}?`)) {
            return
        }

        try {
            const { error: deleteError } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            fetchBookings()
        } catch (err) {
            console.error('Error deleting booking:', err)
            alert('Failed to delete booking')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-accent-kenya/10 text-accent-kenya'
            case 'pending':
                return 'bg-accent-maasai/10 text-accent-maasai'
            case 'completed':
                return 'bg-safari-olive/10 text-safari-olive'
            case 'cancelled':
                return 'bg-neutral-200 text-neutral-600'
            default:
                return 'bg-neutral-100 text-neutral-500'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-safari-night">Bookings</h1>
                    <p className="text-neutral-600 mt-1">Manage villa reservations and guest bookings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-safari-night mb-2">
                            Search Bookings
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by guest name, email, or reference..."
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-safari-night mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading bookings...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchBookings}
                        className="bg-safari-olive text-white px-6 py-2 rounded-lg hover:bg-safari-sand transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Bookings Table */}
            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Reference
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Guest
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Villa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Dates
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Guests
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Total
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
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                                            No bookings found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4 text-sm font-medium text-safari-night">
                                                {booking.booking_reference}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-safari-night">{booking.guest_name}</div>
                                                <div className="text-xs text-neutral-500">{booking.guest_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {villas[booking.villa_id]?.name || 'Unknown Villa'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                <div>{new Date(booking.check_in).toLocaleDateString()}</div>
                                                <div className="text-xs text-neutral-400">
                                                    to {new Date(booking.check_out).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-neutral-400">{booking.nights} nights</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {booking.guests}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-safari-night">
                                                KES {booking.total_price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColor(booking.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={`/admin/bookings/${booking.id}`}
                                                        className="text-safari-olive hover:text-safari-sand font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        className="text-accent-maasai hover:text-accent-maasai/80 font-medium"
                                                        onClick={() => handleDelete(booking.id, booking.booking_reference)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Summary */}
            {!loading && !error && (
                <div className="text-sm text-neutral-600">
                    Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    )
}
