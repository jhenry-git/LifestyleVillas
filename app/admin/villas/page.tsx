'use client'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Villa } from '@/lib/types'

export default function VillasPage() {
    const [villas, setVillas] = useState<Villa[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchVillas()
    }, [statusFilter, searchTerm])

    const fetchVillas = async () => {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.append('status', statusFilter)
            if (searchTerm) params.append('search', searchTerm)

            const response = await fetch(`/api/admin/villas?${params}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch villas')
            }

            setVillas(data.villas || [])
        } catch (err) {
            console.error('Error fetching villas:', err)
            setError(err instanceof Error ? err.message : 'Failed to load villas')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return
        }

        try {
            const response = await fetch(`/api/admin/villas/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete villa')
            }

            // Refresh the list
            fetchVillas()
        } catch (err) {
            console.error('Error deleting villa:', err)
            alert('Failed to delete villa. Please try again.')
        }
    }

    const filteredVillas = villas

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-safari-night">Villas</h1>
                    <p className="text-neutral-600 mt-1">Manage your villa listings</p>
                </div>
                <Link
                    href="/admin/villas/new"
                    className="bg-safari-olive text-white px-6 py-2.5 rounded-lg hover:bg-safari-sand transition-colors font-medium inline-flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Villa
                </Link>
            </div>

            {/* Database Setup Notice */}
            {error && error.includes('Supabase') && (
                <div className="bg-accent-maasai/10 border border-accent-maasai rounded-lg p-4">
                    <h3 className="font-bold text-accent-maasai mb-2">⚠️ Database Not Connected</h3>
                    <p className="text-sm text-neutral-700 mb-2">
                        Please set up your Supabase database to enable villa management.
                    </p>
                    <Link
                        href="/SUPABASE_SETUP.md"
                        className="text-safari-olive hover:text-safari-sand text-sm font-medium"
                    >
                        View Setup Instructions →
                    </Link>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-safari-night mb-2">
                            Search Villas
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name..."
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
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading villas...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && !error.includes('Supabase') && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchVillas}
                        className="bg-safari-olive text-white px-6 py-2 rounded-lg hover:bg-safari-sand transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Villas Table */}
            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Villa Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Price/Night
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {filteredVillas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                            No villas found. Try adjusting your filters or add a new villa.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVillas.map((villa) => (
                                        <tr key={villa.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-safari-night">{villa.name}</div>
                                                <div className="text-xs text-neutral-500">{villa.slug}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                {villa.bedrooms} bed • {villa.bathrooms} bath • {villa.max_guests} guests
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-safari-night">
                                                KES {villa.price_per_night.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${villa.status === 'published'
                                                            ? 'bg-accent-kenya/10 text-accent-kenya'
                                                            : villa.status === 'draft'
                                                                ? 'bg-accent-maasai/10 text-accent-maasai'
                                                                : 'bg-neutral-200 text-neutral-600'
                                                        }`}
                                                >
                                                    {villa.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {villa.featured ? (
                                                    <span className="text-accent-kenya">⭐ Featured</span>
                                                ) : (
                                                    <span className="text-neutral-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={`/villas/${villa.slug}`}
                                                        target="_blank"
                                                        className="text-safari-olive hover:text-safari-sand font-medium"
                                                        title="View on website"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/villas/${villa.id}`}
                                                        className="text-safari-olive hover:text-safari-sand font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className="text-accent-maasai hover:text-accent-maasai/80 font-medium"
                                                        onClick={() => handleDelete(villa.id, villa.name)}
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
                    Showing {filteredVillas.length} villa{filteredVillas.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    )
}
