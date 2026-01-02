'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail, Phone, Calendar, Users, CreditCard, MapPin } from 'lucide-react'

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
    special_requests: string | null
    created_at: string
    updated_at: string
}

interface Villa {
    id: string
    name: string
    slug: string
    price_per_night: number
}

export default function BookingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [booking, setBooking] = useState<Booking | null>(null)
    const [villa, setVilla] = useState<Villa | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        async function fetchBooking() {
            try {
                setLoading(true)
                const { data: bookingData, error: bookingError } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (bookingError) throw bookingError

                setBooking(bookingData)

                // Fetch villa details
                const { data: villaData } = await supabase
                    .from('villas')
                    .select('id, name, slug, price_per_night')
                    .eq('id', bookingData.villa_id)
                    .single()

                setVilla(villaData)
            } catch (err) {
                console.error('Error fetching booking:', err)
                setError(err instanceof Error ? err.message : 'Failed to load booking')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchBooking()
        }
    }, [params.id, supabase])

    const handleStatusChange = async (newStatus: string) => {
        if (!booking) return

        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', booking.id)

            if (updateError) throw updateError

            setBooking({ ...booking, status: newStatus as any })
        } catch (err) {
            console.error('Error updating status:', err)
            alert('Failed to update booking status')
        }
    }

    const handleDelete = async () => {
        if (!booking) return

        if (!confirm(`Are you sure you want to delete booking ${booking.booking_reference}?`)) {
            return
        }

        try {
            const { error: deleteError } = await supabase
                .from('bookings')
                .delete()
                .eq('id', booking.id)

            if (deleteError) throw deleteError

            router.push('/admin/bookings')
        } catch (err) {
            console.error('Error deleting booking:', err)
            alert('Failed to delete booking')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
                    <Link
                        href="/admin/bookings"
                        className="text-safari-olive hover:text-safari-sand font-medium"
                    >
                        ← Back to Bookings
                    </Link>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-accent-kenya text-white'
            case 'pending':
                return 'bg-accent-maasai text-white'
            case 'completed':
                return 'bg-safari-olive text-white'
            case 'cancelled':
                return 'bg-neutral-400 text-white'
            default:
                return 'bg-neutral-200 text-neutral-600'
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center text-sm text-neutral-500 hover:text-safari-olive mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Bookings
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-safari-night">Booking Details</h1>
                        <p className="text-neutral-600 mt-1">Reference: {booking.booking_reference}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Guest Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-lg font-bold text-safari-night mb-4">Guest Information</h2>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Users className="w-5 h-5 text-safari-olive mr-3" />
                                <div>
                                    <p className="text-sm text-neutral-500">Name</p>
                                    <p className="font-medium text-safari-night">{booking.guest_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-safari-olive mr-3" />
                                <div>
                                    <p className="text-sm text-neutral-500">Email</p>
                                    <a href={`mailto:${booking.guest_email}`} className="font-medium text-safari-olive hover:text-safari-sand">
                                        {booking.guest_email}
                                    </a>
                                </div>
                            </div>
                            {booking.guest_phone && (
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 text-safari-olive mr-3" />
                                    <div>
                                        <p className="text-sm text-neutral-500">Phone</p>
                                        <a href={`tel:${booking.guest_phone}`} className="font-medium text-safari-olive hover:text-safari-sand">
                                            {booking.guest_phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-lg font-bold text-safari-night mb-4">Booking Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-safari-olive mr-3 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-500">Villa</p>
                                    <p className="font-medium text-safari-night">{villa?.name || 'Unknown Villa'}</p>
                                    {villa && (
                                        <Link
                                            href={`/villas/${villa.slug}`}
                                            target="_blank"
                                            className="text-sm text-safari-olive hover:text-safari-sand"
                                        >
                                            View Villa →
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-safari-olive mr-3 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-500">Check-in</p>
                                    <p className="font-medium text-safari-night">
                                        {new Date(booking.check_in).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-safari-olive mr-3 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-500">Check-out</p>
                                    <p className="font-medium text-safari-night">
                                        {new Date(booking.check_out).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Users className="w-5 h-5 text-safari-olive mr-3 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-500">Number of Guests</p>
                                    <p className="font-medium text-safari-night">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-neutral-200">
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>{booking.nights} nights</span>
                                    <span>KES {villa?.price_per_night ? (villa.price_per_night * booking.nights).toLocaleString() : '—'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-safari-night mt-2 pt-2 border-t">
                                    <span>Total</span>
                                    <span>KES {booking.total_price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-lg font-bold text-safari-night mb-4">Special Requests</h2>
                            <p className="text-neutral-700">{booking.special_requests}</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                    {/* Status Management */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-lg font-bold text-safari-night mb-4">Manage Status</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleStatusChange('pending')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${booking.status === 'pending'
                                        ? 'bg-accent-maasai text-white'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleStatusChange('confirmed')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${booking.status === 'confirmed'
                                        ? 'bg-accent-kenya text-white'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                Confirmed
                            </button>
                            <button
                                onClick={() => handleStatusChange('completed')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${booking.status === 'completed'
                                        ? 'bg-safari-olive text-white'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => handleStatusChange('cancelled')}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${booking.status === 'cancelled'
                                        ? 'bg-neutral-400 text-white'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-lg font-bold text-safari-night mb-4">Metadata</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-neutral-500">Created</p>
                                <p className="text-safari-night">
                                    {new Date(booking.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-500">Last Updated</p>
                                <p className="text-safari-night">
                                    {new Date(booking.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                        <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
                        <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Delete Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
