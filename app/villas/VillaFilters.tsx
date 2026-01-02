'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'

export default function VillaFilters({ totalCount }: { totalCount: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Helper to update URL without refreshing full page
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <section className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-40 shadow-sm">
            <div className="container-premium py-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                    {/* Filter Controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <div className="flex items-center gap-2 text-safari-night font-medium min-w-fit">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters:</span>
                        </div>

                        <select
                            onChange={(e) => updateFilter('capacity', e.target.value)}
                            defaultValue={searchParams.get('capacity') || ''}
                            className="bg-neutral-50 border-none text-sm font-medium focus:ring-2 focus:ring-safari-olive rounded-full px-4 py-2 cursor-pointer hover:bg-neutral-100 transition-colors"
                        >
                            <option value="all">Any Capacity</option>
                            <option value="2">2+ Guests</option>
                            <option value="4">4+ Guests</option>
                            <option value="6">6+ Guests</option>
                            <option value="8">8+ Guests</option>
                        </select>

                        <select
                            onChange={(e) => updateFilter('price', e.target.value)}
                            defaultValue={searchParams.get('price') || ''}
                            className="bg-neutral-50 border-none text-sm font-medium focus:ring-2 focus:ring-safari-olive rounded-full px-4 py-2 cursor-pointer hover:bg-neutral-100 transition-colors"
                        >
                            <option value="all">Any Price</option>
                            <option value="low">Under KES 15k</option>
                            <option value="mid">KES 15k - 20k</option>
                            <option value="high">KES 20k+</option>
                        </select>
                    </div>

                    {/* Results Counter */}
                    <div className="text-sm text-neutral-500 whitespace-nowrap">
                        Showing <span className="font-bold text-safari-night">{totalCount}</span> luxury stays
                    </div>
                </div>
            </div>
        </section>
    )
}
