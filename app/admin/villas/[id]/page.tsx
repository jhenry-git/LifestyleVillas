'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { createClient } from '@/lib/supabase/client'

interface VillaFormData {
    name: string
    slug: string
    description: string
    long_description: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    price_per_night: number
    location: string
    status: 'draft' | 'published' | 'archived'
    featured: boolean
    highlights: string
    amenities: string
}

const SECTIONS = ['Living Room', 'Bedrooms', 'Kitchen', 'Bathrooms', 'Verandah', 'Exterior']

// Create client once outside component to prevent re-renders
const supabase = createClient()

export default function EditVillaPage() {
    const params = useParams()
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [featuredImage, setFeaturedImage] = useState<string | null>(null)
    const [sectionImages, setSectionImages] = useState<Record<string, string[]>>({})

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<VillaFormData>({
        defaultValues: {
            status: 'draft',
            bedrooms: 2,
            bathrooms: 2,
            max_guests: 4,
            price_per_night: 15000,
            featured: false,
            location: 'Nanyuki, Kenya'
        }
    })

    // Fetch villa data
    useEffect(() => {
        async function fetchVilla() {
            try {
                setLoading(true)
                const { data, error: fetchError } = await supabase
                    .from('villas')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (fetchError) throw fetchError

                if (data) {
                    // Populate form
                    reset({
                        name: data.name,
                        slug: data.slug,
                        description: data.description || '',
                        long_description: data.long_description || '',
                        bedrooms: data.bedrooms,
                        bathrooms: data.bathrooms,
                        max_guests: data.max_guests,
                        price_per_night: data.price_per_night,
                        location: data.location || 'Nanyuki, Kenya',
                        status: data.status,
                        featured: data.featured,
                        amenities: Array.isArray(data.amenities) ? data.amenities.join('\n') : '',
                        highlights: Array.isArray(data.highlights) ? data.highlights.join('\n') : ''
                    })

                    // Set featured image
                    setFeaturedImage(data.featured_image || null)

                    // Parse section images
                    if (Array.isArray(data.images)) {
                        const imagesMap: Record<string, string[]> = {}
                        data.images.forEach((item: any) => {
                            if (typeof item === 'object' && item.category && Array.isArray(item.images)) {
                                imagesMap[item.category] = item.images
                            }
                        })
                        setSectionImages(imagesMap)
                    }
                }
            } catch (err) {
                console.error('Error fetching villa:', err)
                setError(err instanceof Error ? err.message : 'Failed to load villa')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchVilla()
        }
    }, [params.id, reset]) // Removed supabase from dependencies

    const handleSectionImagesChange = (section: string, newImages: string[]) => {
        setSectionImages(prev => ({
            ...prev,
            [section]: newImages
        }))
    }

    const onSubmit = async (data: VillaFormData) => {
        try {
            setSubmitting(true)
            setError(null)

            // Convert textarea strings to arrays
            const amenitiesArray = data.amenities
                ? data.amenities.split('\n').map(i => i.trim()).filter(Boolean)
                : []

            const highlightsArray = data.highlights
                ? data.highlights.split('\n').map(i => i.trim()).filter(Boolean)
                : []

            // Transform sectionImages map into an array of objects for storage
            const structuredImages = Object.entries(sectionImages)
                .filter(([_, imgs]) => imgs.length > 0)
                .map(([category, imgs]) => ({
                    category,
                    images: imgs
                }))

            const payload = {
                ...data,
                images: structuredImages,
                featured_image: featuredImage,
                amenities: amenitiesArray,
                highlights: highlightsArray,
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                max_guests: Number(data.max_guests),
                price_per_night: Number(data.price_per_night)
            }

            const response = await fetch(`/api/admin/villas/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to update villa')
            }

            router.push('/admin/villas')
            router.refresh()
        } catch (err) {
            console.error('Error updating villa:', err)
            setError(err instanceof Error ? err.message : 'Failed to update villa')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error && !loading) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link
                        href="/admin/villas"
                        className="text-safari-olive hover:text-safari-sand font-medium"
                    >
                        ← Back to Villas
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/villas"
                    className="inline-flex items-center text-sm text-neutral-500 hover:text-safari-olive mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Villas
                </Link>
                <h1 className="text-3xl font-bold text-safari-night">Edit Villa</h1>
                <p className="text-neutral-600 mt-1">Update villa listing details</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-bold text-safari-night mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Villa Name *
                            </label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                                placeholder="e.g. Safari Vista Lodge"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Slug (URL) *
                            </label>
                            <input
                                {...register('slug', { required: 'Slug is required' })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent bg-neutral-50 text-safari-night"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Short Description
                            </label>
                            <input
                                {...register('description')}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                                placeholder="Brief overview for cards (1-2 sentences)"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Long Description
                            </label>
                            <textarea
                                {...register('long_description')}
                                rows={4}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                                placeholder="Detailed description of the property experience..."
                            />
                        </div>
                    </div>
                </div>

                {/* Details & Pricing */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-bold text-safari-night mb-4">Details & Pricing</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Bedrooms *
                            </label>
                            <input
                                type="number"
                                {...register('bedrooms', { required: true, min: 1 })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Bathrooms *
                            </label>
                            <input
                                type="number"
                                {...register('bathrooms', { required: true, min: 1 })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Max Guests *
                            </label>
                            <input
                                type="number"
                                {...register('max_guests', { required: true, min: 1 })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Price per Night (KES) *
                            </label>
                            <input
                                type="number"
                                {...register('price_per_night', { required: true, min: 0 })}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent text-safari-night"
                            />
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-bold text-safari-night mb-4">Gallery & Media</h2>

                    {/* Featured Image */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Featured Image (Cover)</label>
                        <p className="text-sm text-neutral-500 mb-4">This will be the main image shown on listing cards.</p>
                        <div className="max-w-md">
                            <ImageUploader
                                images={featuredImage ? [featuredImage] : []}
                                onImagesChange={(imgs) => setFeaturedImage(imgs[0] || null)}
                                maxImages={1}
                            />
                        </div>
                    </div>

                    {/* Sectional Uploads */}
                    <div className="space-y-8">
                        <h3 className="text-md font-bold text-neutral-900 border-b pb-2">Room Categories</h3>

                        {SECTIONS.map((section) => (
                            <div key={section}>
                                <label className="block text-sm font-medium text-safari-olive mb-2">{section}</label>
                                <ImageUploader
                                    images={sectionImages[section] || []}
                                    onImagesChange={(imgs) => handleSectionImagesChange(section, imgs)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-bold text-safari-night mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Amenities (one per line)
                            </label>
                            <textarea
                                {...register('amenities')}
                                rows={6}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent font-mono text-sm text-safari-night"
                                placeholder="WiFi&#10;Swimming Pool&#10;Full Kitchen"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Highlights (one per line)
                            </label>
                            <textarea
                                {...register('highlights')}
                                rows={6}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent font-mono text-sm text-safari-night"
                                placeholder="Panoramic Mountain View&#10;5-min to Ol Pejeta"
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-bold text-safari-night mb-4">Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Status
                            </label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('featured')}
                                    className="w-5 h-5 text-safari-olive rounded focus:ring-safari-olive border-gray-300"
                                    checked={watch('featured')}
                                    onChange={(e) => setValue('featured', e.target.checked)}
                                />
                                <span className="ml-2 text-sm font-medium text-neutral-700">Mark as Featured Villa</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 sticky bottom-6 bg-white/80 p-4 backdrop-blur-md rounded-lg shadow-lg border border-white/20 z-40">
                    <Link
                        href="/admin/villas"
                        className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-safari-olive text-white rounded-lg font-medium hover:bg-safari-sand transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            'Update Villa'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
