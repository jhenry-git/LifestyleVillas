'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/auth-client'

interface ImageUploaderProps {
    images: string[]
    onImagesChange: (urls: string[]) => void
    maxImages?: number
}

export default function ImageUploader({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setError(null)
            setUploading(true)

            if (!e.target.files || e.target.files.length === 0) {
                return
            }

            const newImages = [...images]

            for (const file of Array.from(e.target.files)) {
                if (newImages.length >= maxImages) {
                    setError(`Maximum ${maxImages} images allowed`)
                    break
                }

                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
                const filePath = `villa-images/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('villas')
                    .upload(filePath, file)

                if (uploadError) {
                    throw uploadError
                }

                const { data } = supabase.storage
                    .from('villas')
                    .getPublicUrl(filePath)

                newImages.push(data.publicUrl)
            }

            onImagesChange(newImages)
        } catch (err) {
            console.error('Error uploading image:', err)
            setError('Failed to upload image')
        } finally {
            setUploading(false)
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeImage = (indexToRemove: number) => {
        onImagesChange(images.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden group">
                        <Image
                            src={url}
                            alt={`Villa image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-safari-olive hover:bg-safari-olive/5 transition-colors"
                    >
                        {uploading ? (
                            <div className="w-8 h-8 border-4 border-safari-olive border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm text-neutral-500">Add Image</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            <p className="text-xs text-neutral-500">
                Supported formats: JPG, PNG, WEBP. Max size: 5MB.
            </p>
        </div>
    )
}
